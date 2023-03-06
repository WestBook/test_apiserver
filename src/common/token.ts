import Crypto from 'crypto';

/**
 * 創建 token
 * @param uid
 * @returns 
 */
export function CreateToken(uid: string): string {
    const term = 1000 * 60 * 60 * 24 * 7;  // token 過期期限， 毫秒*秒*分*時*天
    let timestamp = Date.now() + term;
    let hash = Scrypt( `${uid}_${timestamp}`);
    const token = `${uid}_${timestamp}:${hash}`.toString();
    return Buffer.from(token, 'utf8').toString('base64');   // 轉換成 base64
}

/**
 * 對使用者 token 進行解密驗證
 * @param token 
 * @returns 
 */
export function VerifyToken(token: string): boolean | number {
    try {
        let string = Buffer.from(token, 'base64').toString('utf8');
        let [info, hash] = string.split(':');
        let [uid, timestamp] = info.split('_');
        if(Scrypt( `${uid}_${timestamp}`) !== hash){    // token 驗證失敗
            return false;
        }
        else if(Number(timestamp) < Date.now()) {   // token 時效過期
            return false;
        }
        else {
            return true;
        }        
    } catch (error) {   // token 驗證肯定有哪邊出錯了！
        return false;
    }
}

export function tokenParse(token: string) {
    let string = Buffer.from(token, 'base64').toString('utf8');
    let [info, hash] = string.split(':');
    let [uid, timestamp] = info.split('_');
    if(!uid) {
        return '';
    }
    return uid;
}

/**
 * 對使用者資訊進行 hash 加密
 * @param info 
 * @returns 
 */
function Scrypt(info: string): string {
    let secret = 'h5gameserver';
    let hash = Crypto.createHmac('sha256', secret).update(info).digest('hex').slice(0, 16);
    return hash;
}