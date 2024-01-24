

const processSocket = (msg = {}, io) => {
    const {
        method, data, brand_id, title
    } = msg;
    if (method == 'deposit') {
        io.emit('message', {
            method, data, brand_id, title
        });
    }
}

module.exports = {
    processSocket,
}