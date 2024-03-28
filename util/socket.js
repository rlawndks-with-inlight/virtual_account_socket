

const processSocket = (msg = {}, io) => {
    const {
        method, data, brand_id, title
    } = msg;
    let method_list = [
        `deposit`,
        'settle_request',
        'withdraw_request',
        'settle_plus'
    ]
    if (method_list.includes(method)) {
        io.emit('message', {
            method, data, brand_id, title
        });
    }
}

module.exports = {
    processSocket,
}