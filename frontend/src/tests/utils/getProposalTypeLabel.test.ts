import { getProposalTypeLabel } from "../../lib/utils/getProposalTypeLabel";
import { GOVERNANCE_ACTIONS_FILTERS } from "../../constants/governanceAction/filters";

describe("getProposalTypeLabel", () => {
  it("should return the correct label for a known type", () => {
    expect(getProposalTypeLabel("NoConfidence")).toBe("No Confidence");
    expect(getProposalTypeLabel("NewCommittee")).toBe(
      "New Constitutional Committee or Quorum Size"
    );
    expect(getProposalTypeLabel("NewConstitution")).toBe(
      "Update to the Constitution"
    );
    expect(getProposalTypeLabel("HardForkInitiation")).toBe("Hard Fork");
    expect(getProposalTypeLabel("ParameterChange")).toBe(
      "Protocol Parameter Changes"
    );
    expect(getProposalTypeLabel("TreasuryWithdrawals")).toBe(
      "Treasury Withdrawals"
    );
    expect(getProposalTypeLabel("InfoAction")).toBe("Info Action");
  });

  it("should return the type itself if the type is unknown", () => {
    expect(getProposalTypeLabel("unknown")).toBe("unknown");
    expect(getProposalTypeLabel("custom")).toBe("custom");
    expect(getProposalTypeLabel("notExistingType")).toBe("notExistingType");
  });
});
