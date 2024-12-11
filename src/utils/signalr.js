import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
export const connection = new HubConnectionBuilder()
    .withUrl(`https://bingo-backend.zetabox.tn/api/notificationsHub`)
    .configureLogging(LogLevel.Information)
    .build();
export const startConnection = async (connection) => {
    try {
        if (!connection) return;
        await connection.start();
        connection.onclose(e => {
            connection.stop()
        });
        console.log(connection.state)
    } catch (e) {
        console.log(e);
    }
}
export const stopConnection = async (connection) => {
    try {
        if (!connection) return;
        await connection.stop();
        console.log(connection.state)
    } catch (e) {
        console.log(e);
    }
}