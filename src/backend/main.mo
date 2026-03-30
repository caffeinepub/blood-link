import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Blob "mo:core/Blob";
import Nat8 "mo:core/Nat8";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type BloodGroup = { #A_pos; #A_neg; #B_pos; #B_neg; #AB_pos; #AB_neg; #O_pos; #O_neg };
  type UrgencyLevel = { #Low; #Medium; #High; #Critical };

  module BloodGroup {
    public func toText(bg : BloodGroup) : Text {
      switch (bg) {
        case (#A_pos) "A+"; case (#A_neg) "A-"; case (#B_pos) "B+"; case (#B_neg) "B-";
        case (#AB_pos) "AB+"; case (#AB_neg) "AB-"; case (#O_pos) "O+"; case (#O_neg) "O-";
      };
    };
    public func compare(bg1 : BloodGroup, bg2 : BloodGroup) : Order.Order {
      Text.compare(toText(bg1), toText(bg2));
    };
  };

  module UrgencyLevel {
    public func toText(ul : UrgencyLevel) : Text {
      switch (ul) {
        case (#Low) "Low"; case (#Medium) "Medium"; case (#High) "High"; case (#Critical) "Critical";
      };
    };
  };

  type Donor = { donorId : Principal; name : Text; bloodGroup : BloodGroup; area : Text; contactInfo : Text; lastDonation : Time.Time };

  type RecipientRequest = { requestId : Principal; patientName : Text; requiredBloodGroup : BloodGroup; hospitalName : Text; urgencyLevel : UrgencyLevel; area : Text; timestamp : Time.Time };

  type ContactSubmission = { name : Text; email : Text; message : Text; timestamp : Time.Time };
  type DonorInput = { name : Text; bloodGroup : BloodGroup; area : Text; contactInfo : Text };
  type RecipientRequestInput = { patientName : Text; requiredBloodGroup : BloodGroup; hospitalName : Text; urgencyLevel : UrgencyLevel; area : Text };
  public type UserProfile = { name : Text; email : Text; phone : Text };

  // ── Stable storage (survives canister upgrades) ──────────────────────────────
  stable var stableDonors : [Donor] = [];
  stable var stableRecipientRequests : [RecipientRequest] = [];
  stable var stablePendingDonors : [Donor] = [];
  stable var stablePendingRecipientRequests : [RecipientRequest] = [];
  stable var stableContactSubmissions : [ContactSubmission] = [];
  stable var donorCounter : Nat = 200;
  stable var requestCounter : Nat = 200;
  stable var seeded : Bool = false;

  // ── In-memory working maps ───────────────────────────────────────────────────
  let donors = Map.empty<Principal, Donor>();
  let recipientRequests = Map.empty<Principal, RecipientRequest>();
  let pendingDonors = Map.empty<Principal, Donor>();
  let pendingRecipientRequests = Map.empty<Principal, RecipientRequest>();
  let contactSubmissions = List.empty<ContactSubmission>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func counterToPrincipal(prefix : Nat8, n : Nat) : Principal {
    let b0 = Nat8.fromNat(n / 16777216 % 256);
    let b1 = Nat8.fromNat(n / 65536 % 256);
    let b2 = Nat8.fromNat(n / 256 % 256);
    let b3 = Nat8.fromNat(n % 256);
    Blob.fromArray([prefix, b0, b1, b2, b3]).fromBlob();
  };

  // Sort descending by time (most recent first)
  func donorByTimeDesc(d1 : Donor, d2 : Donor) : Order.Order {
    if (d1.lastDonation > d2.lastDonation) { #less }
    else if (d1.lastDonation < d2.lastDonation) { #greater }
    else { #equal };
  };

  func requestByTimeDesc(r1 : RecipientRequest, r2 : RecipientRequest) : Order.Order {
    if (r1.timestamp > r2.timestamp) { #less }
    else if (r1.timestamp < r2.timestamp) { #greater }
    else { #equal };
  };

  let seedTime : Time.Time = 1_700_000_000_000_000_000;

  let donorData : [(Text, Text, BloodGroup, Text, Text)] = [
    ("sd01", "Aarav Sharma",    #A_pos,  "Mumbai",        "9876543201"),
    ("sd02", "Priya Patel",     #B_pos,  "Delhi",         "9876543202"),
    ("sd03", "Ravi Kumar",      #O_pos,  "Bangalore",     "9876543203"),
    ("sd04", "Sneha Reddy",     #AB_pos, "Chennai",       "9876543204"),
    ("sd05", "Vikram Singh",    #A_neg,  "Hyderabad",     "9876543205"),
    ("sd06", "Anjali Mehta",    #B_neg,  "Pune",          "9876543206"),
    ("sd07", "Karan Gupta",     #O_neg,  "Kolkata",       "9876543207"),
    ("sd08", "Meera Nair",      #AB_neg, "Ahmedabad",     "9876543208"),
    ("sd09", "Arjun Verma",     #A_pos,  "Jaipur",        "9876543209"),
    ("sd10", "Divya Iyer",      #B_pos,  "Surat",         "9876543210"),
    ("sd11", "Rohit Joshi",     #O_pos,  "Lucknow",       "9876543211"),
    ("sd12", "Pooja Agarwal",   #A_neg,  "Nagpur",        "9876543212"),
    ("sd13", "Suresh Rao",      #AB_pos, "Indore",        "9876543213"),
    ("sd14", "Kavita Malhotra", #B_neg,  "Bhopal",        "9876543214"),
    ("sd15", "Nikhil Bansal",   #O_pos,  "Patna",         "9876543215"),
    ("sd16", "Ritika Chopra",   #A_pos,  "Chandigarh",    "9876543216"),
    ("sd17", "Aditya Tiwari",   #O_neg,  "Vadodara",      "9876543217"),
    ("sd18", "Nisha Desai",     #B_pos,  "Coimbatore",    "9876543218"),
    ("sd19", "Manish Sinha",    #AB_neg, "Kochi",         "9876543219"),
    ("sd20", "Geeta Pillai",    #A_neg,  "Visakhapatnam", "9876543220"),
    ("sd21", "Sanjay Mishra",   #O_pos,  "Agra",          "9876543221"),
    ("sd22", "Lalita Yadav",    #B_neg,  "Varanasi",      "9876543222"),
  ];

  let requestData : [(Text, Text, BloodGroup, Text, UrgencyLevel, Text)] = [
    ("sr01", "Amit Khanna",     #A_pos,  "AIIMS Delhi",            #Critical, "Delhi"),
    ("sr02", "Sunita Rao",      #B_pos,  "KEM Hospital",           #High,     "Mumbai"),
    ("sr03", "Deepak Nair",     #O_pos,  "Manipal Hospital",       #Medium,   "Bangalore"),
    ("sr04", "Rekha Sharma",    #AB_pos, "Apollo Hospital",        #Low,      "Chennai"),
    ("sr05", "Vijay Patel",     #A_neg,  "Fortis Hospital",        #Critical, "Hyderabad"),
    ("sr06", "Suman Gupta",     #B_neg,  "Ruby Hall Clinic",       #High,     "Pune"),
    ("sr07", "Hemant Bose",     #O_neg,  "SSKM Hospital",          #Medium,   "Kolkata"),
    ("sr08", "Nandita Iyer",    #AB_neg, "Civil Hospital",         #Low,      "Ahmedabad"),
    ("sr09", "Rahul Verma",     #A_pos,  "SMS Hospital",           #High,     "Jaipur"),
    ("sr10", "Archana Joshi",   #B_pos,  "New Civil Hospital",     #Critical, "Surat"),
    ("sr11", "Mohan Agarwal",   #O_pos,  "KGMU",                   #Medium,   "Lucknow"),
    ("sr12", "Preethi Reddy",   #A_neg,  "GMCH Nagpur",            #High,     "Nagpur"),
    ("sr13", "Sachin Malhotra", #AB_pos, "MY Hospital",            #Low,      "Indore"),
    ("sr14", "Usha Bansal",     #B_neg,  "Hamidia Hospital",       #Critical, "Bhopal"),
    ("sr15", "Lalit Chopra",    #O_pos,  "PMCH",                   #High,     "Patna"),
    ("sr16", "Chitra Singh",    #A_pos,  "PGIMER",                 #Medium,   "Chandigarh"),
    ("sr17", "Ajay Desai",      #O_neg,  "SSG Hospital",           #Low,      "Vadodara"),
    ("sr18", "Sumathy Kumar",   #B_pos,  "GKNM Hospital",          #Critical, "Coimbatore"),
    ("sr19", "Binu Thomas",     #AB_neg, "Medical Trust Hospital", #High,     "Kochi"),
    ("sr20", "Venu Prasad",     #A_neg,  "King George Hospital",   #Medium,   "Visakhapatnam"),
    ("sr21", "Rajesh Tiwari",   #O_pos,  "SN Medical College",    #Low,      "Agra"),
    ("sr22", "Meena Yadav",     #B_neg,  "BHU Hospital",           #Critical, "Varanasi"),
  ];

  func seedDonors() {
    for ((id, name, bg, area, contact) in donorData.values()) {
      let pid = id.encodeUtf8().fromBlob();
      donors.add(pid, { donorId = pid; name; bloodGroup = bg; area; contactInfo = contact; lastDonation = seedTime });
    };
  };

  func seedRequests() {
    for ((id, name, bg, hospital, urgency, area) in requestData.values()) {
      let pid = id.encodeUtf8().fromBlob();
      recipientRequests.add(pid, { requestId = pid; patientName = name; requiredBloodGroup = bg; hospitalName = hospital; urgencyLevel = urgency; area; timestamp = seedTime });
    };
  };

  // ── Boot: seed only on very first deploy (seeded flag = false) ───────────────
  if (not seeded) {
    seedDonors();
    seedRequests();
    seeded := true;
  };

  // ── Upgrade hooks ────────────────────────────────────────────────────────────
  system func preupgrade() {
    stableDonors := donors.values().toArray();
    stableRecipientRequests := recipientRequests.values().toArray();
    stablePendingDonors := pendingDonors.values().toArray();
    stablePendingRecipientRequests := pendingRecipientRequests.values().toArray();
    stableContactSubmissions := contactSubmissions.toArray();
  };

  system func postupgrade() {
    // Restore in-memory maps from stable storage after upgrade
    for (d in stableDonors.values()) { donors.add(d.donorId, d) };
    for (r in stableRecipientRequests.values()) { recipientRequests.add(r.requestId, r) };
    for (d in stablePendingDonors.values()) { pendingDonors.add(d.donorId, d) };
    for (r in stablePendingRecipientRequests.values()) { pendingRecipientRequests.add(r.requestId, r) };
    for (c in stableContactSubmissions.values()) { contactSubmissions.add(c) };
    // Clear stable arrays (data is now in in-memory maps)
    stableDonors := [];
    stableRecipientRequests := [];
    stablePendingDonors := [];
    stablePendingRecipientRequests := [];
    stableContactSubmissions := [];
  };

  func areaMatches(recordArea : Text, searchArea : Text) : Bool {
    if (searchArea == "") { return true };
    recordArea.toLower().contains(#text (searchArea.toLower()));
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be signed in to save profile");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller = _ }) func registerDonor(input : DonorInput) : async () {
    donorCounter += 1;
    let newId = counterToPrincipal(0xD0, donorCounter);
    pendingDonors.add(newId, { donorId = newId; name = input.name; bloodGroup = input.bloodGroup; area = input.area; contactInfo = input.contactInfo; lastDonation = Time.now() });
  };

  public shared ({ caller = _ }) func registerRecipientRequest(input : RecipientRequestInput) : async () {
    requestCounter += 1;
    let newId = counterToPrincipal(0xE0, requestCounter);
    pendingRecipientRequests.add(newId, { requestId = newId; patientName = input.patientName; requiredBloodGroup = input.requiredBloodGroup; hospitalName = input.hospitalName; urgencyLevel = input.urgencyLevel; area = input.area; timestamp = Time.now() });
  };

  public query ({ caller = _ }) func getPendingDonors() : async [Donor] {
    pendingDonors.values().toArray().sort(donorByTimeDesc);
  };

  public query ({ caller = _ }) func getPendingRecipientRequests() : async [RecipientRequest] {
    pendingRecipientRequests.values().toArray().sort(requestByTimeDesc);
  };

  public shared ({ caller = _ }) func approveDonor(donorId : Principal) : async Bool {
    switch (pendingDonors.get(donorId)) {
      case null { false };
      case (?donor) {
        donors.add(donorId, donor);
        ignore pendingDonors.remove(donorId);
        true;
      };
    };
  };

  public shared ({ caller = _ }) func rejectDonor(donorId : Principal) : async Bool {
    switch (pendingDonors.get(donorId)) {
      case null { false };
      case (_) {
        ignore pendingDonors.remove(donorId);
        true;
      };
    };
  };

  public shared ({ caller = _ }) func approveRecipientRequest(requestId : Principal) : async Bool {
    switch (pendingRecipientRequests.get(requestId)) {
      case null { false };
      case (?req) {
        recipientRequests.add(requestId, req);
        ignore pendingRecipientRequests.remove(requestId);
        true;
      };
    };
  };

  public shared ({ caller = _ }) func rejectRecipientRequest(requestId : Principal) : async Bool {
    switch (pendingRecipientRequests.get(requestId)) {
      case null { false };
      case (_) {
        ignore pendingRecipientRequests.remove(requestId);
        true;
      };
    };
  };

  public shared ({ caller = _ }) func deleteDonor(donorId : Principal) : async Bool {
    switch (donors.get(donorId)) {
      case null { false };
      case (_) {
        ignore donors.remove(donorId);
        true;
      };
    };
  };

  public shared ({ caller = _ }) func deleteRecipientRequest(requestId : Principal) : async Bool {
    switch (recipientRequests.get(requestId)) {
      case null { false };
      case (_) {
        ignore recipientRequests.remove(requestId);
        true;
      };
    };
  };

  public shared ({ caller = _ }) func updateDonor(donorId : Principal, input : DonorInput) : async Bool {
    switch (donors.get(donorId)) {
      case null { false };
      case (?existing) {
        donors.add(donorId, { donorId; name = input.name; bloodGroup = input.bloodGroup; area = input.area; contactInfo = input.contactInfo; lastDonation = existing.lastDonation });
        true;
      };
    };
  };

  public shared ({ caller = _ }) func updateRecipientRequest(requestId : Principal, input : RecipientRequestInput) : async Bool {
    switch (recipientRequests.get(requestId)) {
      case null { false };
      case (?existing) {
        recipientRequests.add(requestId, { requestId; patientName = input.patientName; requiredBloodGroup = input.requiredBloodGroup; hospitalName = input.hospitalName; urgencyLevel = input.urgencyLevel; area = input.area; timestamp = existing.timestamp });
        true;
      };
    };
  };

  public query ({ caller = _ }) func searchDonorsByBloodGroupAndArea(bloodGroup : BloodGroup, area : Text) : async [Donor] {
    donors.values().toArray().filter(
      func(donor) {
        donor.bloodGroup == bloodGroup and areaMatches(donor.area, area)
      }
    ).sort(donorByTimeDesc);
  };

  public query ({ caller = _ }) func searchRecipientRequestsByBloodGroupAndArea(bloodGroup : BloodGroup, area : Text) : async [RecipientRequest] {
    recipientRequests.values().toArray().filter(
      func(request) {
        request.requiredBloodGroup == bloodGroup and areaMatches(request.area, area)
      }
    ).sort(requestByTimeDesc);
  };

  public query ({ caller = _ }) func getAllDonors() : async [Donor] {
    donors.values().toArray().sort(donorByTimeDesc);
  };

  public query ({ caller = _ }) func getAllRecipientRequests() : async [RecipientRequest] {
    recipientRequests.values().toArray().sort(requestByTimeDesc);
  };

  public shared ({ caller = _ }) func submitContactForm(name : Text, email : Text, message : Text) : async () {
    contactSubmissions.add({ name; email; message; timestamp = Time.now() });
  };

  public query ({ caller }) func getAllContactSubmissions() : async [ContactSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access contact submissions");
    };
    contactSubmissions.toArray();
  };

  public query ({ caller = _ }) func getDonorById(donorId : Principal) : async ?Donor {
    donors.get(donorId);
  };

  public query ({ caller = _ }) func getRecipientRequestById(requestId : Principal) : async ?RecipientRequest {
    recipientRequests.get(requestId);
  };
};
