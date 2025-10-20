export class Method {
    /**
     * 循環範圍(例如 min= 1 , max = 2) 當val = 3 >> return: 1 ,當val = 5 >> return: 1 超過最大值會循環到最小值繼續往下
     * @param val 數值
     * @param min 最小值
     * @param max 最大值
     * */
    public static LoopRange(val: number, min: number, max: number): number {
        let result = val;
        let interval = max - min + 1;

        if (result > max) {
            result = (result - min) % interval + min;
        } else if (result < min) {
            let mI = (min - result) % interval;
            result = mI == 0 ? min : interval - mI + min;
        }
        return result;
    }
  
    public static GetRandom(min: number, max: number): number {
        return (Math.random() * (max - min) >> 0) + min;
    }

    /**
     * 限定數值範圍
     * @param val 數值
     * @param min 最小值
     * @param max 最大值
     */
    public static Clamp(val: number, min: number, max: number): number {
        return Math.min(Math.max(val, min), max);
    }

    /**
     * 找出兩陣列交集
     * @param arr1 陣列1
     * @param arr2 陣列2
     */
    public static ArrayIntersection<T>(arr1: T[], arr2: T[]): T[] {
        let result = arr1.filter((e) => {
            return arr2.indexOf(e) > -1;
        });
        return result;
    }

    /**
     * 找出兩陣列差集
     * @param arr1 陣列1
     * @param arr2 陣列2
     */
    public static ArrayDifferenceSet<T>(arr1: T[], arr2: T[]): T[] {
        let result = arr1.filter((e) => {
            return arr2.indexOf(e) === -1;
        });
        return result;
    }

    /**
     * 找出兩陣列補集
     * @param arr1 陣列1
     * @param arr2 陣列2
     */
    public static ArrayComplement<T>(arr1: T[], arr2: T[]): T[] {
        let result = arr1
            .filter((e) => {
                return arr2.indexOf(e) === -1;
            })
            .concat(
                arr2.filter((f) => {
                    return arr1.indexOf(f) === -1;
                })
            );

        return result;
    }

    /**
     * 效能較好的深拷貝
     * @param {any} obj - 要拷貝的物件
     */
    public static DeepClone(obj: any): any {
        if (null == obj || 'object' !== typeof obj) {
            return obj;
        }

        if (obj instanceof Date) {
            let copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        if (obj instanceof Array) {
            let copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.DeepClone(obj[i]);
            }
            return copy;
        }

        if (obj instanceof Object) {
            let copy = {};
            for (let attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = this.DeepClone(obj[attr]);
                }
            }
            return copy;
        }
        throw new Error('Unable to copy obj! Its type isn\'t supported.');
    }
}