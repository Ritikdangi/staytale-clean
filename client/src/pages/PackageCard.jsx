import { Rating } from "@mui/material";
import React from "react";
import { FaMapMarkerAlt, FaBed, FaUtensils, FaCar, FaTicketAlt, FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const PackageCard = ({ packageData }) => {
  const discountPercent = packageData.packageOffer
    ? Math.round(
        ((+packageData.packagePrice - +packageData.packageDiscountPrice) /
          +packageData.packagePrice) *
          100
      )
    : 0;

  const navigate = useNavigate();

  return (
    <Link to={`/package/${packageData._id}`} className="w-full">
      <article className="w-full bg-white/60 backdrop-blur-sm border border-transparent hover:border-blue-200 rounded-lg shadow-sm hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-1 overflow-hidden">
        <div className="relative w-full">
          <img
            src={packageData.packageImages?.[0]}
            alt={packageData.packageName}
            className="w-full h-[220px] object-cover"
          />
          {/* overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          {/* name & location */}
          <div className="absolute left-4 bottom-3 text-white">
            <h3 className="font-bold text-lg leading-tight">{packageData.packageName}</h3>
            <div className="flex items-center text-sm gap-2 mt-1 opacity-90">
              <FaMapMarkerAlt />
              <span className="capitalize">{packageData.packageDestination}</span>
            </div>
          </div>
          {/* discount badge */}
          {packageData.packageOffer && (
            <div className="absolute right-3 top-3 bg-green-700 text-white text-sm px-3 py-1 rounded-full font-semibold">
              {discountPercent}% Off
            </div>
          )}
        </div>

        <div className="p-3 flex flex-col gap-2">
          {/* amenities row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <FaBed className="text-sky-500" />
              <span className="truncate">{packageData.packageAccommodation || 'Accommodation'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUtensils className="text-sky-500" />
              <span className="truncate">{packageData.packageMeals || 'Meals'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCar className="text-sky-500" />
              <span className="truncate">{packageData.packageTransportation || 'Transport'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTicketAlt className="text-sky-500" />
              <span className="truncate">{packageData.packageActivities || 'Activities'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="flex items-center gap-2">
                {packageData.packageTotalRatings > 0 ? (
                  <>
                    <Rating value={packageData.packageRating} size="small" readOnly precision={0.1} />
                    <span className="text-sm text-gray-600">({packageData.packageTotalRatings})</span>
                  </>
                ) : (
                  <div className="flex items-center gap-1 text-sm text-gray-500"><FaStar /> <span>New</span></div>
                )}
              </div>
            </div>

            <div className="text-right">
              {packageData.packageOffer ? (
                <div className="flex items-center gap-2">
                  <span className="line-through text-gray-500 text-sm">{packageData.packagePrice} RS</span>
                  <span className="text-lg font-semibold text-sky-600">{packageData.packageDiscountPrice} RS</span>
                </div>
              ) : (
                <div className="text-lg font-semibold text-sky-600">{packageData.packagePrice} RS</div>
              )}
            </div>
          </div>

            <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/booking/${packageData._id}`);
              }}
              className="bg-sky-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-sky-700 transition-colors"
            >
              Book
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/package/${packageData._id}`);
              }}
              className="text-sm text-gray-600 hover:underline"
            >
              View details
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PackageCard;
