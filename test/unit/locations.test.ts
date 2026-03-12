import { describe, it, expect, vi, beforeEach } from "vitest";
import { Mulphilog } from "../../src/index.js";

describe("Locations API", () => {
  const clientOptions = {
    username: "testuser",
    password: "testpassword",
    accountNo: "12345",
    insertType: 1,
    returnLocation: 1,
    subAccountId: 1,
  };

  const client = Mulphilog(clientOptions);

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  describe("getLocations", () => {
    it("should successfully retrieve locations", async () => {
      const mockResponse = [
        {
          isSuccess: "true",
          message: "Success",
          locations: [{ LocationID: "1", LocationName: "Karachi Hub" }],
        },
      ];

      (vi.mocked(fetch) as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getLocations();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.isSuccess).toBe("true");
        expect(result.data.message).toBe("Success");
      }
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/Locations/Get_locations"),
        expect.any(Object),
      );
    });

    it("should handle error response", async () => {
      (vi.mocked(fetch) as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const result = await client.getLocations();

      expect(result.ok).toBe(false);
    });
  });

  describe("addLocation", () => {
    it("should successfully add a location", async () => {
      const mockResponse = [
        {
          isSuccess: "true",
          message: "Location added successfully",
        },
      ];

      (vi.mocked(fetch) as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.addLocation({
        branchCode: 123,
        locationName: "Test Location",
        locationAddress: "123 Test St",
        to: ["to@example.com"],
        cc: ["cc@example.com"],
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.isSuccess).toBe("true");
        expect(result.data.message).toBe("Location added successfully");
      }
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/Locations/AddLocation"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"userId":"testuser"'),
        }),
      );
    });
  });

  describe("getCities", () => {
    it("should successfully retrieve cities", async () => {
      const mockResponse = [
        {
          isSuccess: "true",
          message: "Success",
          cities: [{ CityID: "1", CityName: "Karachi" }],
        },
      ];

      (vi.mocked(fetch) as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getCities();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.isSuccess).toBe("true");
      }
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/Branches/Get_Cities"),
        expect.any(Object),
      );
    });
  });
});
