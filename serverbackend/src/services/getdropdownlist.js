import { Country } from "../models/address/country.js";
import { State } from "../models/address/state.js";
import { District } from "../models/address/district.js";
import { ApiResponse, ApiError } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const parseLocationId = (value, fieldName) => {
  if (typeof value !== "string" || !/^\d+$/.test(value.trim())) {
    throw new ApiError(400, `${fieldName} must be a positive integer`);
  }

  const id = Number(value.trim());
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new ApiError(400, `${fieldName} must be a positive integer`);
  }

  return id;
};

const getCountry = asyncHandler(async (req, res) => {
  const countries = await Country.find({})
    .select("_id name")
    .sort({ name: 1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, { countries }, "Countries fetched successfully")
  );
});

const getState = asyncHandler(async (req, res) => {
  const countryId = parseLocationId(req.query.countryId, "countryId");
  const states = await State.find({ country: countryId })
    .select("_id name")
    .sort({ name: 1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, { states }, "States fetched successfully")
  );
});


const getDistrict = asyncHandler(async (req, res) => {
  const stateId = parseLocationId(req.query.stateId, "stateId");
  const districts = await District.find({ state: stateId })
    .select("_id name")
    .sort({ name: 1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, { districts }, "Districts fetched successfully")
  );
});

export { getCountry, getState, getDistrict };
