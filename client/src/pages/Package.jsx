import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaClock,
  FaMapMarkerAlt,
  FaShare,
  FaBed,
  FaUtensils,
  FaTrain,
  FaHiking,
  FaImage,
  FaTimes,
} from "react-icons/fa";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import RatingCard from "./RatingCard";

const API_URL = import.meta.env.VITE_API_URL;

const Package = () => {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageRating: 0,
    packageTotalRatings: 0,
    packageImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ratingsData, setRatingsData] = useState({
    rating: 0,
    review: "",
    packageId: params?.id,
    userRef: currentUser?._id,
    username: currentUser?.username,
    userProfileImg: currentUser?.avatar,
  });
  const [packageRatings, setPackageRatings] = useState([]);
  const [ratingGiven, setRatingGiven] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/package/get-package-data/${params?.id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data?.success) {
        setPackageData({
          packageName: data?.packageData?.packageName,
          packageDescription: data?.packageData?.packageDescription,
          packageDestination: data?.packageData?.packageDestination,
          packageDays: data?.packageData?.packageDays,
          packageNights: data?.packageData?.packageNights,
          packageAccommodation: data?.packageData?.packageAccommodation,
          packageTransportation: data?.packageData?.packageTransportation,
          packageMeals: data?.packageData?.packageMeals,
          packageActivities: data?.packageData?.packageActivities,
          packagePrice: data?.packageData?.packagePrice,
          packageDiscountPrice: data?.packageData?.packageDiscountPrice,
          packageOffer: data?.packageData?.packageOffer,
          packageRating: data?.packageData?.packageRating,
          packageTotalRatings: data?.packageData?.packageTotalRatings,
          packageImages: data?.packageData?.packageImages,
        });
        setLoading(false);
      } else {
        setError(data?.message || "Something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const giveRating = async () => {
    checkRatingGiven();
    if (ratingGiven) {
      alert("You already submittd your rating!");
      return;
    }
    if (ratingsData.rating === 0 && ratingsData.review === "") {
      alert("Atleast 1 field is required!");
      return;
    }
    if (
      ratingsData.rating === 0 &&
      ratingsData.review === "" &&
      !ratingsData.userRef
    ) {
      alert("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/rating/give-rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingsData),
        credentials: "include",
      });
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        getPackageData();
        getRatings();
        checkRatingGiven();
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRatings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rating/get-ratings/${params.id}/4`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data) {
        setPackageRatings(data);
      } else {
        setPackageRatings("No ratings yet!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkRatingGiven = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rating/rating-given/${currentUser?._id}/${params?.id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setRatingGiven(data?.given);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) {
      getPackageData();
      getRatings();
    }
    if (currentUser) {
      checkRatingGiven();
    }
  }, [params.id, currentUser]);

  return (
    <div className="w-full">
      {loading && (
        <p className="text-center font-semibold" id="loading">
          Loading...
        </p>
      )}
      {error && (
        <div className="flex flex-col w-full items-center gap-2">
          <p className="text-center text-red-700">Something went wrong!</p>
          <Link
            className="bg-slate-600 text-white p-3 py-2 rounded-lg w-min"
            to="/"
          >
            Back
          </Link>
        </div>
      )}
      {packageData && !loading && !error && (
        <div className="w-full">
          {/* Hero gallery: always show 3-photo layout; fill missing with placeholders */}
          <div className="relative">
            <div className="px-5 pt-5">
              {(() => {
                const imgs = packageData?.packageImages || [];
                const slots = [0, 1, 2].map((idx) => ({
                  url: imgs[idx] || null,
                  key: idx,
                }));
                const extraCount = Math.max(0, imgs.length - 3);
                const openGalleryAt = (idx) => {
                  if (!imgs || imgs.length === 0) return;
                  setInitialSlide(Math.min(Math.max(idx, 0), imgs.length - 1));
                  setGalleryOpen(true);
                };
                const Placeholder = ({ className }) => (
                  <div className={`flex items-center justify-center bg-slate-200 text-slate-600 ${className} rounded-xl`}>
                    <div className="flex flex-col items-center gap-1">
                      <FaImage className="text-2xl" />
                      <span className="text-xs font-medium">No Image</span>
                    </div>
                  </div>
                );
                return (
                  <>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {/* Large primary image */}
                      <div className="sm:col-span-2">
                        {slots[0].url ? (
                          <button type="button" onClick={() => openGalleryAt(0)} className="block w-full">
                            <img
                              src={slots[0].url}
                              alt="primary"
                              className="w-full h-[260px] sm:h-[420px] md:h-[480px] lg:h-[520px] object-cover rounded-xl"
                              loading="lazy"
                            />
                          </button>
                        ) : (
                          <Placeholder className="w-full h-[260px] sm:h-[420px] md:h-[480px] lg:h-[520px]" />
                        )}
                      </div>
                      {/* Right side stacked images on sm+ */}
                      <div className="hidden sm:flex flex-col gap-4">
                        {slots[1].url ? (
                          <button type="button" onClick={() => openGalleryAt(1)} className="block w-full">
                            <img
                              src={slots[1].url}
                              alt="secondary-1"
                              className="w-full h-[205px] md:h-[230px] lg:h-[250px] object-cover rounded-xl"
                              loading="lazy"
                            />
                          </button>
                        ) : (
                          <Placeholder className="w-full h-[205px] md:h-[230px] lg:h-[250px]" />
                        )}
                        <div className="relative">
                          {slots[2].url ? (
                            <button type="button" onClick={() => openGalleryAt(2)} className="block w-full">
                              <img
                                src={slots[2].url}
                                alt="secondary-2"
                                className="w-full h-[205px] md:h-[230px] lg:h-[250px] object-cover rounded-xl"
                                loading="lazy"
                              />
                            </button>
                          ) : (
                            <Placeholder className="w-full h-[205px] md:h-[230px] lg:h-[250px]" />
                          )}
                          {extraCount > 0 && (
                            <button
                              type="button"
                              onClick={() => openGalleryAt(2)}
                              className="absolute inset-0 rounded-xl bg-black/45 text-white font-semibold flex items-center justify-center"
                            >
                              +{extraCount} photos
                            </button>
                          )}
                        </div>
                      </div>
                      {/* On small screens, show the two extra images below in a row */}
                      <div className="sm:hidden col-span-2 grid grid-cols-2 gap-4">
                        {slots[1].url ? (
                          <button type="button" onClick={() => openGalleryAt(1)} className="block w-full">
                            <img
                              src={slots[1].url}
                              alt="secondary-1"
                              className="w-full h-28 object-cover rounded-lg"
                              loading="lazy"
                            />
                          </button>
                        ) : (
                          <Placeholder className="w-full h-28 rounded-lg" />
                        )}
                        <div className="relative">
                          {slots[2].url ? (
                            <button type="button" onClick={() => openGalleryAt(2)} className="block w-full">
                              <img
                                src={slots[2].url}
                                alt="secondary-2"
                                className="w-full h-28 object-cover rounded-lg"
                                loading="lazy"
                              />
                            </button>
                          ) : (
                            <Placeholder className="w-full h-28 rounded-lg" />
                          )}
                          {extraCount > 0 && (
                            <button
                              type="button"
                              onClick={() => openGalleryAt(2)}
                              className="absolute inset-0 rounded-lg bg-black/45 text-white text-sm font-semibold flex items-center justify-center"
                            >
                              +{extraCount} photos
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Share button */}
            <div className="absolute top-4 right-4 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100/90 backdrop-blur-sm cursor-pointer shadow">
              <FaShare
                className="text-slate-600"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              />
            </div>
            {copied && (
              <p className="absolute top-20 right-4 z-10 rounded-md bg-slate-100/90 px-3 py-1 shadow">
                Link copied!
              </p>
            )}
            {/* Back button */}
            <div className="absolute top-4 left-4 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100/90 backdrop-blur-sm cursor-pointer shadow">
              <FaArrowLeft
                className="text-slate-600"
                onClick={() => {
                  navigate("/");
                }}
              />
            </div>
          </div>
          {/* Full gallery modal */}
          {galleryOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-white font-semibold">Gallery</span>
                <button
                  type="button"
                  onClick={() => setGalleryOpen(false)}
                  className="text-white p-2 rounded hover:bg-white/10"
                  aria-label="Close gallery"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 px-2 pb-6">
                <Swiper navigation initialSlide={initialSlide}>
                  {(packageData?.packageImages || []).map((imageUrl, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={imageUrl}
                        alt={`gallery-${i}`}
                        loading="lazy"
                        className="w-full h-[70vh] md:h-[80vh] object-contain bg-black"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
            {/* Main content (left) */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-3xl md:text-4xl font-serif font-extrabold leading-tight">{packageData?.packageName}</h1>
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-3">
                      {packageData?.packageOffer ? (
                        <>
                          <span className="text-lg text-gray-500 line-through">{packageData?.packagePrice} RS</span>
                          <span className="text-2xl font-bold">{packageData?.packageDiscountPrice} RS</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">{packageData?.packagePrice} RS</span>
                      )}
                      {packageData?.packageOffer && (
                        <span className="ml-3 inline-block bg-green-700 text-white px-3 py-1 rounded-full text-sm font-semibold">{Math.floor(((+packageData?.packagePrice - +packageData?.packageDiscountPrice) / +packageData?.packagePrice) * 100)}% Off</span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-gray-700">
                      <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-green-700"/> <span className="font-medium">{packageData?.packageDestination}</span></span>
                      {( +packageData?.packageDays > 0 || +packageData?.packageNights > 0) && (
                        <span className="flex items-center gap-2 text-sm"><FaClock /> <span className="font-medium">{+packageData?.packageDays > 0 ? (packageData?.packageDays + (packageData?.packageDays>1? ' Days':' Day')) : ''}{+packageData?.packageNights > 0 ? ' - ' + (packageData?.packageNights + (packageData?.packageNights>1? ' Nights':' Night')) : ''}</span></span>
                      )}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4">
                    {packageData?.packageTotalRatings > 0 && (
                      <div className="flex items-center gap-2"><Rating value={packageData?.packageRating || 0} readOnly precision={0.1} /> <div className="text-sm text-gray-600">({packageData?.packageTotalRatings})</div></div>
                    )}
                  </div>
                </div>
                <div className="mt-5">
                  <h4 className="text-lg font-semibold mb-2">Overview</h4>
                  <p className="text-sm text-gray-800 leading-relaxed">{packageData?.packageDescription}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold mb-4">Amenities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <FaBed className="text-2xl text-gray-700 mt-1" />
                    <div><div className="text-sm font-medium">Accommodation</div><div className="text-sm text-gray-700">{packageData?.packageAccommodation}</div></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaHiking className="text-2xl text-gray-700 mt-1" />
                    <div><div className="text-sm font-medium">Activities</div><div className="text-sm text-gray-700">{packageData?.packageActivities}</div></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaUtensils className="text-2xl text-gray-700 mt-1" />
                    <div><div className="text-sm font-medium">Meals</div><div className="text-sm text-gray-700">{packageData?.packageMeals}</div></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaTrain className="text-2xl text-gray-700 mt-1" />
                    <div><div className="text-sm font-medium">Transportation</div><div className="text-sm text-gray-700">{packageData?.packageTransportation}</div></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold mb-4">Rating & Reviews</h4>
                <div>
                  {!currentUser ? (
                    <div className="text-center"><button onClick={() => navigate('/login')} className="px-4 py-2 bg-green-700 text-white rounded">Login to rate</button></div>
                  ) : currentUser?.role === 'admin' ? (
                    <div className="p-4 rounded border bg-yellow-50 text-sm text-gray-800">Admin accounts are restricted from submitting public reviews.</div>
                  ) : ratingGiven ? (
                    <div className="p-4 rounded border bg-slate-50 text-sm text-gray-800">You have already submitted a review for this package.</div>
                  ) : (
                    <form className="flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <Rating name="simple-controlled" value={ratingsData?.rating} onChange={(e, newValue) => setRatingsData({...ratingsData, rating: newValue})} />
                        <div className="text-sm text-gray-600">Select rating and write your feedback below</div>
                      </div>
                      <textarea className="w-full resize-none p-4 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-200" rows={4} placeholder="Share your experience — what you liked, what could be improved" value={ratingsData?.review} onChange={(e) => setRatingsData({...ratingsData, review: e.target.value})}></textarea>
                      <div className="flex justify-end"><button disabled={(ratingsData.rating === 0 && ratingsData.review === '') || loading} type="button" onClick={(e) => { e.preventDefault(); giveRating(); }} className="px-5 py-2 bg-green-700 text-white rounded disabled:opacity-60">{loading ? 'Submitting...' : 'Submit Review'}</button></div>
                    </form>
                  )}
                </div>
                <div className="mt-6"><RatingCard packageRatings={packageRatings} /></div>
                {packageData.packageTotalRatings > 4 && (<div className="mt-4 text-center"><button onClick={() => navigate(`/package/ratings/${params?.id}`)} className="flex items-center justify-center text-lg gap-2 p-2 rounded border hover:bg-slate-500 hover:text-white">View All <FaArrowRight /></button></div>)}
              </div>
            </div>

            {/* Booking CTA aside */}
            <aside className="md:col-span-1">
              <div className="sticky top-24 bg-white rounded-lg shadow p-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    {packageData?.packageOffer ? (
                      <>
                        <div className="text-sm text-gray-500 line-through">{packageData?.packagePrice} RS</div>
                        <div className="text-2xl font-bold">{packageData?.packageDiscountPrice} RS</div>
                      </>
                    ) : (
                      <div className="text-2xl font-bold">{packageData?.packagePrice} RS</div>
                    )}
                  </div>
                  {packageData?.packageOffer && (<div className="inline-block bg-green-700 text-white px-3 py-1 rounded-full text-sm font-semibold">{Math.floor(((+packageData?.packagePrice - +packageData?.packageDiscountPrice) / +packageData?.packagePrice) * 100)}% Off</div>)}
                </div>
                <div className="mt-4"><button type="button" onClick={() => { if (currentUser) { navigate(`/booking/${params?.id}`); } else { navigate('/login'); } }} className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold">Book Now</button></div>
                <div className="mt-3 text-xs text-gray-500">Secure booking • Free cancellation</div>
                {packageData?.packageTotalRatings > 0 && (<div className="mt-4 flex items-center gap-2"><Rating value={packageData?.packageRating || 0} readOnly precision={0.1} /> <div className="text-sm text-gray-600">({packageData?.packageTotalRatings})</div></div>)}
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};

export default Package;
