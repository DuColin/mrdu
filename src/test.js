// 某网络设备使用转发芯片处理业务报文，转发芯片会分配一定大小的存储空间（字节的整数倍）用于存储某关键数据，该关键数据有一个或多个字段，为尽量减少占用空间，系统提供了一种紧密排列机制：
// 各字段都有一个位宽，依次记录于 fieldLimits，各字段按照位宽依次紧密排列。
// 每次存储数据 fieldValues 时，把每个字段值 fieldValues[i] 按 bit 位填入对应的字段中；一个字段的数据不足该字段的位宽时，左侧补 0。
// 注：fieldLimits.length == fieldValues.length，fieldLimits[i]与fieldValues[i]一一对应。
// 整个数据总 bit 位不满足 8bit（一个字节）的整数倍时，左侧补 0。用例保证补 0 后总数据宽度不超过 48bit。
// 按照以上规则输出存储空间的内容（16 进制字符串形式）。

function main(fieldLimits, fieldValues) {
    let valsStr = '';
    for (let i = 0; i < fieldLimits.length; i += 1) {
        const limit = fieldLimits[i];
        const value = fieldValues[i];

        const formatValue = value.toString(2).padStart(limit, 0);
        valsStr += formatValue;
    }

    const byteCount = Math.ceil(valsStr.length / 8) * 8;
    const formatValue = valsStr.padStart(byteCount, '0');

    let result = '';
    let len = 8;
    for (let i = 0; i < formatValue.length; i += len) {
        const str = formatValue.substring(i, i+8);
        const hexStr = parseInt(str, 2).toString(16).padStart(2, '0');
        result += hexStr;
    }
    return result;
}