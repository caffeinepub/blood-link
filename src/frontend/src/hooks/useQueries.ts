import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BloodGroup,
  type Donor,
  type DonorInput,
  type RecipientRequest,
  type RecipientRequestInput,
  UrgencyLevel,
} from "../backend";
import { useActor } from "./useActor";

export { BloodGroup, UrgencyLevel };

export function useGetAllRecipientRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["recipientRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecipientRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllDonors() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["donors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDonors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchDonors(
  bloodGroup: BloodGroup | null,
  area: string,
  enabled: boolean,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["searchDonors", bloodGroup, area],
    queryFn: async () => {
      if (!actor || !bloodGroup) return [];
      return actor.searchDonorsByBloodGroupAndArea(bloodGroup, area);
    },
    enabled: !!actor && !isFetching && enabled && !!bloodGroup,
  });
}

export function useSearchRecipients(
  bloodGroup: BloodGroup | null,
  area: string,
  enabled: boolean,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["searchRecipients", bloodGroup, area],
    queryFn: async () => {
      if (!actor || !bloodGroup) return [];
      return actor.searchRecipientRequestsByBloodGroupAndArea(bloodGroup, area);
    },
    enabled: !!actor && !isFetching && enabled && !!bloodGroup,
  });
}

export function useRegisterDonor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: DonorInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerDonor(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      queryClient.invalidateQueries({ queryKey: ["pendingDonors"] });
    },
  });
}

export function useRegisterRecipient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RecipientRequestInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerRecipientRequest(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipientRequests"] });
      queryClient.invalidateQueries({ queryKey: ["pendingRecipientRequests"] });
    },
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      message,
    }: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitContactForm(name, email, message);
    },
  });
}

export function useGetPendingDonors() {
  const { actor, isFetching } = useActor();
  return useQuery<Donor[]>({
    queryKey: ["pendingDonors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingDonors();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useGetPendingRecipientRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<RecipientRequest[]>({
    queryKey: ["pendingRecipientRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingRecipientRequests();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useApproveDonor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (donorId: Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveDonor(donorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingDonors"] });
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

export function useRejectDonor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (donorId: Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectDonor(donorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingDonors"] });
    },
  });
}

export function useApproveRecipientRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveRecipientRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingRecipientRequests"] });
      queryClient.invalidateQueries({ queryKey: ["recipientRequests"] });
    },
  });
}

export function useRejectRecipientRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectRecipientRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingRecipientRequests"] });
    },
  });
}

export function useDeleteDonor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (donorId: Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteDonor(donorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

export function useDeleteRecipientRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteRecipientRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipientRequests"] });
    },
  });
}

export function useUpdateDonor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      donorId,
      input,
    }: { donorId: Principal; input: DonorInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateDonor(donorId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

export function useUpdateRecipientRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      requestId,
      input,
    }: { requestId: Principal; input: RecipientRequestInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateRecipientRequest(requestId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipientRequests"] });
    },
  });
}
