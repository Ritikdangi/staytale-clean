import React, { useEffect, useRef, useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";
import "./admin/styles/DashboardStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../redux/user/userSlice";

const API_URL = import.meta.env.VITE_API_URL;
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import MyBookings from "./user/MyBookings";
import UpdateProfile from "./user/UpdateProfile";
import MyHistory from "./user/MyHistory";
import MyPayments from "./user/MyPayments";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [profilePhoto, setProfilePhoto] = useState(undefined);
  const [photoPercentage, setPhotoPercentage] = useState(0);
  const [activePanelId, setActivePanelId] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleProfilePhoto = (photo) => {
    try {
      dispatch(updateUserStart());
      const storage = getStorage(app);
      const photoname = new Date().getTime() + photo.name.replace(/\s/g, "");
      const storageRef = ref(storage, `profile-photos/${photoname}`); //profile-photos - folder name in firebase
      const uploadTask = uploadBytesResumable(storageRef, photo);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          //   console.log(progress);
          setPhotoPercentage(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            const res = await fetch(
              `/api/user/update-profile-photo/${currentUser._id}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": " application/json",
                },
                body: JSON.stringify({ avatar: downloadUrl }),
              }
            );
            const data = await res.json();
            if (data?.success) {
              alert(data?.message);
              setFormData({ ...formData, avatar: downloadUrl });
              dispatch(updateUserSuccess(data?.user));
              setProfilePhoto(null);
              return;
            } else {
              dispatch(updateUserFailure(data?.message));
            }
            dispatch(updateUserFailure(data?.message));
            alert(data?.message);
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data?.success !== true) {
        dispatch(logOutFailure(data?.message));
        return;
      }
      dispatch(logOutSuccess());
      navigate("/login");
      alert(data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const CONFIRM = confirm(
      "Are you sure ? the account will be permenantly deleted!"
    );
    if (CONFIRM) {
      try {
        dispatch(deleteUserAccountStart());
        const res = await fetch(`${API_URL}/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();
        if (data?.success === false) {
          dispatch(deleteUserAccountFailure(data?.message));
          alert("Something went wrong!");
          return;
        }
        dispatch(deleteUserAccountSuccess());
        alert(data?.message);
      } catch (error) {}
    }
  };

  return (
    <div className="flex w-full flex-wrap max-sm:flex-col p-2">
      {currentUser ? (
        <>
          <div className="w-[40%] p-3 max-sm:w-full">
            <aside className="profile-card">
              <div className="profile-top">
                {formData.avatar ? (
                  <img
                    src={
                      (profilePhoto && URL.createObjectURL(profilePhoto)) ||
                      formData.avatar
                    }
                    alt={`${currentUser.username} avatar`}
                    className="profile-avatar"
                    onClick={() => fileRef.current.click()}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") fileRef.current.click();
                    }}
                  />
                ) : (
                  <div className="profile-avatar placeholder">
                    <FaUserCircle aria-hidden className="text-6xl text-slate-400" />
                  </div>
                )}
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  hidden
                  ref={fileRef}
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                />
                {profilePhoto && (
                  <div className="upload-row">
                    <button
                      onClick={() => handleProfilePhoto(profilePhoto)}
                      className="btn btn-primary small"
                    >
                      {photoPercentage > 0 && photoPercentage < 100
                        ? `Uploading (${photoPercentage}%)`
                        : "Upload"}
                    </button>
                    {photoPercentage > 0 && (
                      <div className="progress-wrap">
                        <div
                          className="progress-fill"
                          style={{ width: `${photoPercentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="profile-body">
                <h3 className="profile-name">Hi {currentUser.username}!</h3>

                <div className="info-list">
                  <div className="info-row">
                    <FaEnvelope className="info-icon" aria-hidden />
                    <div>
                      <div className="info-label">Email</div>
                      <div className="info-value">{currentUser.email}</div>
                    </div>
                  </div>

                  <div className="info-row">
                    <FaPhone className="info-icon" aria-hidden />
                    <div>
                      <div className="info-label">Phone</div>
                      <div className="info-value">{currentUser.phone}</div>
                    </div>
                  </div>

                  <div className="info-row">
                    <FaMapMarkerAlt className="info-icon" aria-hidden />
                    <div>
                      <div className="info-label">Address</div>
                      <div className="info-value">{currentUser.address}</div>
                    </div>
                  </div>
                </div>

                <div className="action-row-bottom">
                  <button
                    onClick={() => setActivePanelId(3)}
                    className="btn btn-primary"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary"
                  >
                    Log out
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="btn btn-danger"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </aside>
          </div>
          {/* ---------------------------------------------------------------------------------------- */}
          <div className="w-[60%] max-sm:w-full">
            <div>
              <nav className="w-full border-blue-500 border-b-4">
                <div className="w-full flex gap-2">
                  <button
                    className={
                      activePanelId === 1
                        ? "p-1 rounded-t transition-all duration-300 bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300"
                    }
                    id="bookings"
                    onClick={() => setActivePanelId(1)}
                  >
                    Bookings
                  </button>
                  <button
                    className={
                      activePanelId === 2
                        ? "p-1 rounded-t transition-all duration-300 bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300"
                    }
                    id="updateProfile"
                    onClick={() => setActivePanelId(2)}
                  >
                    History
                  </button>
                  <button
                    className={
                      activePanelId === 4
                        ? "p-1 rounded-t transition-all duration-300 bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300"
                    }
                    id="payments"
                    onClick={() => setActivePanelId(4)}
                  >
                    Payments
                  </button>
                </div>
              </nav>
              {/* bookings */}
              <div className="main flex flex-wrap">
                {activePanelId === 1 && <MyBookings />}
                {/* History */}
                {activePanelId === 2 && <MyHistory />}
                {/* Payments */}
                {activePanelId === 4 && <MyPayments />}
                {/* Update profile */}
                {activePanelId === 3 && <UpdateProfile setActivePanelId={setActivePanelId} />}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <p className="text-red-700">Login First</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
