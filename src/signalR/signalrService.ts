import * as signalR from "@microsoft/signalr";


let connection: signalR.HubConnection | null = null; // Lưu connection

export const startSignalRConnection = async () => {
    if (!connection) {
        connection = new signalR.HubConnectionBuilder()
            // .withUrl("https://localhost:7098/api/alerthub", {
            .withUrl("http://app.bdsanthinh.vn/api/alerthub", {
                skipNegotiation: true,  // Bỏ qua quá trình "negotiate"
                transport: signalR.HttpTransportType.WebSockets, // Chỉ dùng WebSockets
            }) // Adjust your API URL
            .withAutomaticReconnect()
            .build();

        try {
            await connection.start();
            console.log("Connected to SignalR");
            // connection.on("ReceiveApartmentNotice", (userIds) => {
            //     dispatch(setNotificationBadgeCountRequest(userIds.length));

            //     // if (info && info.userId) {
            //     //     const user = userIds.filter((x: any) => x === info.userId);
            //     //     if (user) dispatch(setNotificationBadgeCountRequest(user.count));
            //     // }
            // });
        } catch (error) {
            console.error("Connection failed: ", error);
        }
    }
    return connection;
};

export const getSignalRConnection = () => connection; // Truy xuất connection
