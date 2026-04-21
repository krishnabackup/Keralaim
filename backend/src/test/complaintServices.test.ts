import { classifyComplaint } from "../services/complaintServices";

describe("Complaint Classification", () => {
  it("should classify road issues", () => {
    const result = classifyComplaint("road is broken");
    expect(result).toBe("Infrastructure");
  });

  it("should classify water issues", () => {
    const result = classifyComplaint("water leak");
    expect(result).toBe("Water");
  });

  it("should return general category", () => {
    const result = classifyComplaint("random issue");
    expect(result).toBe("General");
  });
});