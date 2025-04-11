import React from "react";
import "./userProfile.css"; // Include a CSS file for styling

const UserProfile = () => {
  // Hardcoded mock data simulating a response from the /me endpoint
  const mockUserData = {
    display_name: "VibeTuneUser",
    email: "vibetuneuser@example.com",
    country: "US",
    explicit_content: {
      filter_enabled: true,
      filter_locked: false,
    },
    external_urls: {
      spotify: "https://open.spotify.com/user/vibetuneuser",
    },
    followers: {
      total: 150,
    },
    id: "vibetuneuser123",
    images: [
      {
        url: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
        height: 300,
        width: 300,
      },
    ],
    product: "premium",
    uri: "spotify:user:vibetuneuser123",
  };

  return (
    <div className="user-profile">
      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={mockUserData.images[0]?.url || "default-profile.png"}
          alt="Profile"
          className="profile-picture"
        />
        <h2>{mockUserData.display_name || "Spotify User"}</h2>
        <p>{mockUserData.followers?.total || 0} Followers</p>
        <a
          href={mockUserData.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Spotify Profile
        </a>
      </div>

      {/* Account Details */}
      <div className="account-details">
        <h3>Account Details</h3>
        <p>
          <strong>Email:</strong> {mockUserData.email || "Not available"}
        </p>
        <p>
          <strong>Country:</strong> {mockUserData.country || "Not available"}
        </p>
        <p>
          <strong>Subscription:</strong> {mockUserData.product || "Unknown"}
        </p>
        <p>
          <strong>Explicit Content Filter:</strong>{" "}
          {mockUserData.explicit_content?.filter_enabled
            ? "Enabled"
            : "Disabled"}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;