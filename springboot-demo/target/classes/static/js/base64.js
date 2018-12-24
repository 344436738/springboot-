    var base64 = {
        encodeChars: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"],
        decodeChars: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1],
        //编码
        encode64: function (str) {
            var out, i, j, len;
            var c1, c2, c3;
            len = str.length;
            i = j = 0;
            out = [];
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out[j++] = this.encodeChars[c1 >> 2];
                    out[j++] = this.encodeChars[(c1 & 0x3) << 4];
                    out[j++] = "==";
                    break;
                }
                c2 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out[j++] = this.encodeChars[c1 >> 2];
                    out[j++] = this.encodeChars[((c1 & 0x03) << 4) | ((c2 & 0xf0) >> 4)];
                    out[j++] = this.encodeChars[(c2 & 0x0f) << 2];
                    out[j++] = "=";
                    break;
                }
                c3 = str.charCodeAt(i++) & 0xff;
                out[j++] = this.encodeChars[c1 >> 2];
                out[j++] = this.encodeChars[((c1 & 0x03) << 4) | ((c2 & 0xf0) >> 4)];
                out[j++] = this.encodeChars[((c2 & 0x0f) << 2) | ((c3 & 0xc0) >> 6)];
                out[j++] = this.encodeChars[c3 & 0x3f];
            }
            return out.join('');
        },
        //解码
        decode64: function (str) {
            var c1, c2, c3, c4;
            var i, j, len, out;
            len = str.length;
            i = j = 0;
            out = [];
            while (i < len) {
                do {
                    c1 = this.decodeChars[str.charCodeAt(i++) & 0xff];
                } while (i < len && c1 == -1);
                if (c1 == -1) break;
                do {
                    c2 = this.decodeChars[str.charCodeAt(i++) & 0xff];
                } while (i < len && c2 == -1);
                if (c2 == -1) break;
                out[j++] = String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
                do {
                    c3 = str.charCodeAt(i++) & 0xff;
                    if (c3 == 61) return out.join('');
                    c3 = this.decodeChars[c3];
                } while (i < len && c3 == -1);
                if (c3 == -1) break;
                out[j++] = String.fromCharCode(((c2 & 0x0f) << 4) | ((c3 & 0x3c) >> 2));
                do {
                    c4 = str.charCodeAt(i++) & 0xff;
                    if (c4 == 61) return out.join('');
                    c4 = this.decodeChars[c4];
                } while (i < len && c4 == -1);
                if (c4 == -1) break;
                out[j++] = String.fromCharCode(((c3 & 0x03) << 6) | c4);
            }
            return out.join('');
        },
        //UTF-16转UTF-8，用于正确编码汉字
        utf16to8: function (str) {
            var out, i, len, c;
            out = "";
            len = str.length;
            for (i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if ((c >= 0x0001) && (c <= 0x007F)) {
                    out += str.charAt(i);
                } else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                } else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
            }
            return out;
        },
        //UTF-8转UTF-16，用于正确解码汉字
        utf8to16: function (str) {
            var out, i, len, c;
            var char2, char3;
            out = "";
            len = str.length;
            i = 0;
            while (i < len) {
                c = str.charCodeAt(i++);
                switch (c >> 4) {
                    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                        // 0xxxxxxx
                        out += str.charAt(i - 1);
                        break;
                    case 12: case 13:
                        // 110x xxxx   10xx xxxx
                        char2 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                        break;
                    case 14:
                        // 1110 xxxx  10xx xxxx  10xx xxxx
                        char2 = str.charCodeAt(i++);
                        char3 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x0F) << 12) |
                           ((char2 & 0x3F) << 6) |
                           ((char3 & 0x3F) << 0));
                        break;
                }
            }
            return out;
        }
    };
//二进制字节流访问
var ByteArray = function (data, endian) {
    this.data = data || ''; //字节流源数据
    this.endian = endian || this.Endian.LITTLE; //字节编码
    this.length = this.data.length; //字节流长度
    this.position = 0; //当前指针
    this.TWOeN23 = Math.pow(2, -23);
    this.TWOeN52 = Math.pow(2, -52);
};
//字节编码
ByteArray.Endian = {
    BIG: 0, //大字节编码
    LITTLE: 1//小字节编码
};
ByteArray.prototype = {
    //从字节流中读取带符号的字节
    readByte: function () {
        return this.data.charCodeAt(this.position++) & 0xFF;
    },
    //从字节流中读取布尔值
    readBoolean: function () {
        return this.data.charCodeAt(this.position++) & 0xFF ? true : false;
    },
    //从字节流中读取一个无符号的 16 位整数
    readUnsignedShort: function () {
        var data = this.data, pos;
        if (this.endian == ByteArray.Endian.BIG) {
            pos = (this.position += 2) - 2;
            return ((data.charCodeAt(pos) & 0xFF) << 8) | (data.charCodeAt(++pos) & 0xFF);
        } else if (this.endian == ByteArray.Endian.LITTLE) {
            pos = (this.position += 2);
            return ((data.charCodeAt(--pos) & 0xFF) << 8) | (data.charCodeAt(--pos) & 0xFF);
        }
    },
    //从字节流中读取一个带符号的 16 位整数
    readShort: function () {
        var data = this.data, pos, x;
        if (this.endian == ByteArray.Endian.BIG) {
            pos = (this.position += 2) - 2;
            x = ((data.charCodeAt(pos) & 0xFF) << 8) | (data.charCodeAt(++pos) & 0xFF);
        } else if (this.endian == ByteArray.Endian.LITTLE) {
            pos = (this.position += 2);
            x = ((data.charCodeAt(--pos) & 0xFF) << 8) | (data.charCodeAt(--pos) & 0xFF);
        }
        return (x >= 32768) ? x - 65536 : x;
    },
    //从字节流中读取一个无符号的 32 位整数
    readUnsignedInt: function () {
        var data = this.data, pos;
        if (this.endian == ByteArray.Endian.BIG) {
            pos = (this.position += 4) - 4;
            return ((data.charCodeAt(pos) & 0xFF) << 24) | ((data.charCodeAt(++pos) & 0xFF) << 16) | ((data.charCodeAt(++pos) & 0xFF) << 8) | (data.charCodeAt(++pos) & 0xFF);
        } else if (this.endian == ByteArray.Endian.LITTLE) {
            pos = (this.position += 4);
            return ((data.charCodeAt(--pos) & 0xFF) << 24) | ((data.charCodeAt(--pos) & 0xFF) << 16) | ((data.charCodeAt(--pos) & 0xFF) << 8) | (data.charCodeAt(--pos) & 0xFF);
        }
    },
    //从字节流中读取一个带符号的 32 位整数
    readInt: function () {
        var data = this.data, pos, x;
        if (this.endian == ByteArray.Endian.BIG) {
            pos = (this.position += 4) - 4;
            x = ((data.charCodeAt(pos) & 0xFF) << 24) | ((data.charCodeAt(++pos) & 0xFF) << 16) | ((data.charCodeAt(++pos) & 0xFF) << 8) | (data.charCodeAt(++pos) & 0xFF);
        } else if (this.endian == ByteArray.Endian.LITTLE) {
            pos = (this.position += 4);
            x = ((data.charCodeAt(--pos) & 0xFF) << 24) | ((data.charCodeAt(--pos) & 0xFF) << 16) | ((data.charCodeAt(--pos) & 0xFF) << 8) | (data.charCodeAt(--pos) & 0xFF);
        }
        return (x >= 2147483648) ? x - 4294967296 : x;
    },
    //从字节流中读取一个无符号的64位整数
    readUnsignedInt64: function () {
        var data = this.data, pos;
        if (this.endian == ByteArray.Endian.BIG) {
        } else if (this.endian == ByteArray.Endian.LITTLE) {
            pos = this.position;
            //低四位和
            var result = (((data.charCodeAt(pos + 3) & 0xFF) << 24) |
            ((data.charCodeAt(pos + 2) & 0xFF) << 16) |
            ((data.charCodeAt(pos + 1) & 0xFF) << 8) |
            ((data.charCodeAt(pos) & 0xFF)));
            //32位表示高四位和
            var result11 = (((data.charCodeAt(pos + 7) & 0xFF) << 24) |
            ((data.charCodeAt(pos + 6) & 0xFF) << 16) |
            ((data.charCodeAt(pos + 5) & 0xFF) << 8) |
            ((data.charCodeAt(pos + 4) & 0xFF)));
            this.position += 8;
            return (result11 * 65536 * 65536 + result); //高4位  低4位
        }
    },
    //从字节流中读取一个带符号的64位整数
    readInt64: function () {
        var data = this.data, pos;
        if (this.endian == ByteArray.Endian.BIG) {
        } else if (this.endian == ByteArray.Endian.LITTLE) {
            pos = this.position;
            //低四位和
            var result = (((data.charCodeAt(pos + 3) & 0xFF) << 24) |
            ((data.charCodeAt(pos + 2) & 0xFF) << 16) |
            ((data.charCodeAt(pos + 1) & 0xFF) << 8) |
            ((data.charCodeAt(pos) & 0xFF)));
            //32位表示高四位和
            var result11 = (((data.charCodeAt(pos + 7) & 0xFF) << 24) |
            ((data.charCodeAt(pos + 6) & 0xFF) << 16) |
            ((data.charCodeAt(pos + 5) & 0xFF) << 8) |
            ((data.charCodeAt(pos + 4) & 0xFF)));
            this.position += 8;
            var rs = (result11 * 65536 * 65536 + result); //高4位  低4位
            if (rs > 4294967296 * 2147483648 - 1) {
                rs -= 4294967296 * 4294967296;
            }
            return rs;
        }
    },
    //从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
    readFloat: function () {
        var data = this.data, pos, b1, b2, b3, b4;
        if (this.endian == ByteArray.Endian.BIG) {
            pos = (this.position += 4) - 4;
            b1 = data.charCodeAt(pos) & 0xFF;
            b2 = data.charCodeAt(++pos) & 0xFF;
            b3 = data.charCodeAt(++pos) & 0xFF;
            b4 = data.charCodeAt(++pos) & 0xFF;
        } else if (this.endian == ByteArray.Endian.LITTLE) {
            pos = (this.position += 4);
            b1 = data.charCodeAt(--pos) & 0xFF;
            b2 = data.charCodeAt(--pos) & 0xFF;
            b3 = data.charCodeAt(--pos) & 0xFF;
            b4 = data.charCodeAt(--pos) & 0xFF;
        }
        var sign = 1 - ((b1 >> 7) << 1);                   // sign = bit 0
        var exp = (((b1 << 1) & 0xFF) | (b2 >> 7)) - 127;  // exponent = bits 1..8
        var sig = ((b2 & 0x7F) << 16) | (b3 << 8) | b4;    // significand = bits 9..31
        if (sig == 0 && exp == -127)
            return 0.0;
        return sign * (1 + this.TWOeN23 * sig) * this.pow(2, exp);
    },
    //从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
    readDouble: function () {
        var data = this.data, pos, b1, b2, b3, b4, b5, b6, b7, b8;
        if (this.endian == ByteArray.Endian.BIG) {
            pos = (this.position += 8) - 8;
            b1 = data.charCodeAt(pos) & 0xFF;
            b2 = data.charCodeAt(++pos) & 0xFF;
            b3 = data.charCodeAt(++pos) & 0xFF;
            b4 = data.charCodeAt(++pos) & 0xFF;
            b5 = data.charCodeAt(++pos) & 0xFF;
            b6 = data.charCodeAt(++pos) & 0xFF;
            b7 = data.charCodeAt(++pos) & 0xFF;
            b8 = data.charCodeAt(++pos) & 0xFF;
        } else if (this.endian == ByteArray.Endian.LITTLE) {
            pos = (this.position += 8);
            b1 = data.charCodeAt(--pos) & 0xFF;
            b2 = data.charCodeAt(--pos) & 0xFF;
            b3 = data.charCodeAt(--pos) & 0xFF;
            b4 = data.charCodeAt(--pos) & 0xFF;
            b5 = data.charCodeAt(--pos) & 0xFF;
            b6 = data.charCodeAt(--pos) & 0xFF;
            b7 = data.charCodeAt(--pos) & 0xFF;
            b8 = data.charCodeAt(--pos) & 0xFF;
        }
        var sign = 1 - ((b1 >> 7) << 1); // sign = bit 0
        var exp = (((b1 << 4) & 0x7FF) | (b2 >> 4)) - 1023; // exponent = bits 1..11
        var sig = (((b2 & 0xF) << 16) | (b3 << 8) | b4).toString(2) + ((b5 >> 7) ? '1' : '0') + (((b5 & 0x7F) << 24) | (b6 << 16) | (b7 << 8) | b8).toString(2); // significand = bits 12..63
        sig = parseInt(sig, 2);
        if (sig == 0 && exp == -1023)
            return 0.0;
        return sign * (1.0 + this.TWOeN52 * sig) * this.pow(2, exp);
    },
    //从字节流中读取一个 UTF-8 字符串
    readUTF: function () {
        var data = this.data;
        var len = this.readUnsignedShort();
        var str = "";
        while (len--) {
            var chr = this.readByte();
            str += String.fromCharCode(chr);
        }
        return str;
    }
};
