import React, { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt, FaLock, FaBed, FaUtensils, FaSwimmingPool, FaSnowflake, FaCalendarAlt, FaPlus, FaMinus, FaCcVisa, FaPaypal, FaExclamationTriangle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Booking = () => {
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
  const [bookingData, setBookingData] = useState({
    totalPrice: 0,
    packageDetails: null,
    buyer: null,
    persons: 1,
    date: null,
  });
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [currentDate, setCurrentDate] = useState("");

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/package/get-package-data/${params?.packageId}`
      );
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

  //get paymentgateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/package/braintree/token`, {
        withCredentials: true,
      });
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [currentUser]);

  //handle payment & book package
  const handleBookPackage = async () => {
    if (
      bookingData.packageDetails === "" ||
      bookingData.buyer === "" ||
      bookingData.totalPrice <= 0 ||
      bookingData.persons <= 0 ||
      bookingData.date === ""
    ) {
      alert("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/booking/book-package/${params?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
        credentials: "include",
      });
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        navigate(`/profile/${currentUser?.role === "admin" ? "admin" : "user"}`);
      } else {
        setLoading(false);
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const scrollToSummary = () => {
    const el = document.getElementById("package-summary");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (params?.packageId) {
      getPackageData();
    }
    let date = new Date().toISOString().substring(0, 10);
    let d = date.substring(0, 8) + (parseInt(date.substring(8)) + 1);
    setCurrentDate(d);
  }, [params?.packageId]);

  useEffect(() => {
    if (packageData && params?.packageId) {
      setBookingData({
        ...bookingData,
        packageDetails: params?.packageId,
        buyer: currentUser?._id,
        totalPrice: packageData?.packageDiscountPrice
          ? packageData?.packageDiscountPrice * bookingData?.persons
          : packageData?.packagePrice * bookingData?.persons,
      });
    }
  }, [packageData, params]);

  return (
    <div className="w-full flex justify-center py-8 pb-28 md:pb-0">
      <div className="w-[95%] grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Right: Booking summary CTA (placed first so it stacks above on mobile) */}
  <aside id="package-summary" className="md:col-span-1 order-first md:order-none">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4 mb-3">
              {packageData.packageImages && packageData.packageImages.length > 0 ? (
                <img src={packageData.packageImages[0]} alt="hotel" className="w-24 h-16 rounded-md object-cover" />
              ) : (
                <div className="w-24 h-16 rounded-md bg-gray-100" />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{packageData.packageName}</h3>
                <p className="flex items-center gap-2 text-green-700"><FaMapMarkerAlt /> <span className="font-medium">{packageData.packageDestination}</span></p>
              </div>
            </div>
            {( +packageData.packageDays > 0 || +packageData.packageNights > 0) && (
              <p className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                <FaClock />
                <span>{+packageData.packageDays > 0 ? packageData.packageDays + (packageData.packageDays>1 ? ' Days' : ' Day') : ''}{+packageData.packageNights > 0 ? ' - ' + packageData.packageNights + (packageData.packageNights>1 ? ' Nights' : ' Night') : ''}</span>
              </p>
            )}
            <div className="mb-3">
              {packageData.packageOffer ? (
                <div className="flex items-baseline gap-3">
                  <div className="text-sm text-gray-500 line-through">{packageData.packagePrice} RS</div>
                  <div className="text-2xl font-bold">{packageData.packageDiscountPrice} RS</div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-green-700">{packageData.packagePrice} RS</div>
              )}
              {packageData.packageOffer && (
                <div className="inline-block bg-green-700 text-white px-3 py-1 rounded-full text-sm font-semibold mt-2">
                  {Math.floor(((+packageData.packagePrice - +packageData.packageDiscountPrice) / +packageData.packagePrice) * 100)}% Off
                </div>
              )}
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">What's included</h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"><FaBed /> {packageData.packageAccommodation ? 'Accommodation' : '—'}</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"><FaUtensils /> {packageData.packageMeals ? 'Meals' : '—'}</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"><FaSwimmingPool /> {packageData.packageActivities ? 'Activities' : '—'}</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"><FaSnowflake /> {packageData.packageTransportation ? 'Transport' : '—'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500"><FaLock className="text-sm" title="Secure booking" /> <span title="Secure booking — Free cancellation">Secure booking • Free cancellation</span></div>
          </div>
        </aside>

        {/* Left: User form (card) */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-serif font-bold mb-4">Book Package</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Username</label>
                <input type="text" className="w-full p-2 border rounded" value={currentUser.username} disabled />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input type="email" className="w-full p-2 border rounded" value={currentUser.email} disabled />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Address</label>
                <textarea className="w-full p-2 border rounded resize-none" rows={3} value={currentUser.address} disabled />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone</label>
                <input type="text" className="w-full p-2 border rounded" value={currentUser.phone} disabled />
              </div>
            </div>

            {/* Booking details fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Select Date</label>
                <input type="date" min={currentDate !== "" ? currentDate : ""} className="w-max p-2 border rounded" onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Persons</label>
                <div className="inline-flex items-center border rounded overflow-hidden">
                  <button className="px-3 py-1" onClick={() => { if (bookingData.persons > 1) { const newPersons = bookingData.persons - 1; setBookingData({ ...bookingData, persons: newPersons, totalPrice: packageData.packageDiscountPrice ? packageData.packageDiscountPrice * newPersons : packageData.packagePrice * newPersons }); } }}>-</button>
                  <div className="px-4">{bookingData.persons}</div>
                  <button className="px-3 py-1" onClick={() => { if (bookingData.persons < 10) { const newPersons = bookingData.persons + 1; setBookingData({ ...bookingData, persons: newPersons, totalPrice: packageData.packageDiscountPrice ? packageData.packageDiscountPrice * newPersons : packageData.packagePrice * newPersons }); } }}>+</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Total Price</label>
                <div className="text-xl font-bold text-green-700">{packageData.packageDiscountPrice ? packageData.packageDiscountPrice * bookingData.persons : packageData.packagePrice * bookingData.persons} RS</div>
              </div>
              <div>
                <p className={`text-sm font-semibold ${instance ? 'text-red-700' : ''}`}>Payment: {!instance ? 'Loading...' : "Don't use your original card details (test mode)"} <span title="Test mode — don't enter real card details" className="ml-2 text-yellow-700"><FaExclamationTriangle /></span></p>

                {/* Payment method tabs (UI only, DropIn handles actual methods) */}
                <div className="mt-3 flex gap-2 items-center">
                  <label className={`flex items-center gap-2 px-3 py-1 rounded cursor-pointer ${paymentMethod==='card' ? 'bg-gray-100 border' : 'bg-transparent'}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod==='card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                    <FaCcVisa /> <span className="text-sm">Card</span>
                  </label>
                  <label className={`flex items-center gap-2 px-3 py-1 rounded cursor-pointer ${paymentMethod==='paypal' ? 'bg-gray-100 border' : 'bg-transparent'}`}>
                    <input type="radio" name="payment" value="paypal" checked={paymentMethod==='paypal'} onChange={() => setPaymentMethod('paypal')} className="hidden" />
                    <FaPaypal /> <span className="text-sm">PayPal</span>
                  </label>
                </div>

                {clientToken && (
                  <div id="payment-area">
                    <div className="mt-3 border rounded p-2">
                      <DropIn options={{ authorization: clientToken, paypal: { flow: 'vault' } }} onInstance={(inst) => setInstance(inst)} />
                    </div>
                    <div className="mt-3 block">
                      <button disabled={loading || !instance || !currentUser?.address} onClick={handleBookPackage} className="w-full px-4 py-2 bg-green-700 hover:shadow-md text-white rounded-lg flex items-center justify-center gap-2">{loading ? 'Processing...' : <><FaLock /> Book Now</>}</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        
        
      </div>
    </div>
  );
};

export default Booking;
