const url = "https://onesignal.com/api/v1/notifications";
const appId = "6247d01a-bfba-45c6-b768-0c3efa3eaea9";
const apiKey = "MzljZjQ5ZDQtNDNlMy00MGFlLTg0MDEtZmMzN2QxODhhMTM5";

export const sendPushNotification = async (
    userId,
    title,
    message,
    largeIcon = "https://raw.githubusercontent.com/NVB07/three-dots-native/refs/heads/master/assets/images/icon.png"
) => {
    const body = {
        app_id: appId,
        include_external_user_ids: [userId], // ID người dùng
        headings: { en: title },
        contents: { en: message }, // Nội dung thông báo
        ios_badgeType: "Increase",
        ios_badgeCount: 1,
        priority: 10,
        android_channel_id: "eea6ed7a-f92b-4daa-8e6c-eeca6531e38b",
        // big_picture: "URL_TO_YOUR_ICON", // Tùy chọn thêm hình ảnh lớn
        small_icon: "ic_stat_onesignal_default",
        // large_icon: "https://raw.githubusercontent.com/NVB07/three-dots-native/refs/heads/master/assets/images/icon.png",
        large_icon: largeIcon,
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${apiKey}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Notification sent:", data);
    } catch (error) {
        console.error("Failed to send notification:", error);
    }
};
