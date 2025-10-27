import { Rating } from "@mui/material";
import React, { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import defaultProfileImg from "../assets/images/profile.png";

const RatingCard = ({ packageRatings }) => {
  const [expanded, setExpanded] = useState({});

  const toggle = (i) => {
    setExpanded((s) => ({ ...s, [i]: !s[i] }));
  };

  if (!packageRatings || packageRatings.length === 0) return <div className="text-sm text-gray-600">No reviews yet</div>;

  return (
    // Responsive grid using auto-fit + minmax to keep card widths stable across viewports
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
    >
      {packageRatings.map((rating, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border p-4 flex flex-col gap-2 w-full"
          role="article"
          aria-label={`review-${i}`}
        >
          <div className="flex items-center gap-3">
            <img src={rating.userProfileImg || defaultProfileImg} alt={rating.username?.[0] || 'U'} className="w-10 h-10 rounded-full object-cover border" />
            <div>
              <div className="font-semibold">{rating.username}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Rating value={rating.rating || 0} readOnly size="small" precision={0.1} />
            <span className="ml-2 text-sm text-gray-600">{rating.rating?.toFixed?.(1) || ''}</span>
          </div>

          <div className="text-sm text-gray-700 break-words whitespace-normal min-h-[3.5rem]">
            {rating.review && rating.review.length > 140 && !expanded[i]
              ? `${rating.review.substring(0, 120)}...`
              : rating.review || (rating.rating < 3 ? 'Not Bad' : 'Good')}
          </div>
          {rating.review && rating.review.length > 140 && (
            <button className="text-sm text-blue-600 mt-2 self-start" onClick={() => toggle(i)}>
              {expanded[i] ? (<><span>Less</span> <FaArrowUp className="inline-block ml-1" /></>) : (<><span>More</span> <FaArrowDown className="inline-block ml-1" /></>)}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default RatingCard;
