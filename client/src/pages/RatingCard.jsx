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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {packageRatings.map((rating, i) => (
        <div key={i} className="bg-white rounded-lg border p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <img src={rating.userProfileImg || defaultProfileImg} alt={rating.username?.[0] || 'U'} className="w-10 h-10 rounded-full object-cover border" />
            <div>
              <div className="font-semibold">{rating.username}</div>
            </div>
          </div>
          <Rating value={rating.rating || 0} readOnly size="small" precision={0.1} />
          <div className="text-sm text-gray-700 break-words">
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
