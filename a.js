// v1: recursion only
/*
var a = (m, n) => {
  if (m == 0) return n+1
  else if (n == 0) return a(m-1, 1)
  else {
      return a(m-1, a(m, n-1))
  }
}

console.log(a(4, 0)) // 13
console.log(a(4, 1)) // errors
*/

//v2: using memoization
/*
var mem = []
for (var i = 0; i < 5; i++) {
    mem[i] = []
}

var get = (m, n) => {
    if (!mem[m][n]) {
        mem[m][n] = a(m, n)
    }
    return mem[m][n]
}

var a = (m, n) => {
  if (m == 0) return n+1
  else if (n == 0) return get(m-1, 1)
  else {
      return a(m-1, get(m, n-1))
  }
}

console.log(a(4, 0)) // 13
console.log(a(4, 1)) // 65533
console.log(a(4, 2)) // "Infinity"
*/

/*
// finding patterns using generated mem
console.log(mem)
>> 
[
  [ <1 empty item>, 2 ],
  [
     2,  3,   4,   5,  6,  7,  8,  9, 10, 11, 12, 13,
    14, 15,  16,  17, 18, 19, 20, 21, 22, 23, 24, 25,
    26, 27,  28,  29, 30, 31, 32, 33, 34, 35, 36, 37,
    38, 39,  40,  41, 42, 43, 44, 45, 46, 47, 48, 49,
    50, 51,  52,  53, 54, 55, 56, 57, 58, 59, 60, 61,
    62, 63,  64,  65, 66, 67, 68, 69, 70, 71, 72, 73,
    74, 75,  76,  77, 78, 79, 80, 81, 82, 83, 84, 85,
    86, 87,  88,  89, 90, 91, 92, 93, 94, 95, 96, 97,
    98, 99, 100, 101,
    ... 65431 more items
  ],
  [
      3,   5,   7,   9,  11,  13,  15,  17,  19,  21,  23,  25,
     27,  29,  31,  33,  35,  37,  39,  41,  43,  45,  47,  49,
     51,  53,  55,  57,  59,  61,  63,  65,  67,  69,  71,  73,
     75,  77,  79,  81,  83,  85,  87,  89,  91,  93,  95,  97,
     99, 101, 103, 105, 107, 109, 111, 113, 115, 117, 119, 121,
    123, 125, 127, 129, 131, 133, 135, 137, 139, 141, 143, 145,
    147, 149, 151, 153, 155, 157, 159, 161, 163, 165, 167, 169,
    171, 173, 175, 177, 179, 181, 183, 185, 187, 189, 191, 193,
    195, 197, 199, 201,
    ... 32665 more items
  ],
  [
        5,   13,    29,
       61,  125,   253,
      509, 1021,  2045,
     4093, 8189, 16381,
    32765
  ],
  [ 13 ]
]
*/

// v3: explicit formulas

// stores "infinite" numbers as arrays of chars
class BigNum {
  constructor(k) {
    if (k instanceof BigNum) {
      this.arr = k.arr
    } else {
      this.arr = ("" + k).split("").reverse().map((d) => {
        return parseInt(d, 10)
      })
    }
  }
  isZero() {
    for (var i = 0; i < this.arr.length; i++) {
      if (this.arr[i] != 0) return false
    }
    return true
  }
  // num * k
  mult(k) {
    var numk = new BigNum(k)
    var r = 0
    var result = []
    // let x, y, z, a, b, c be digits (e.g. xy represent 10x+y)
    // and xy*z = abc, then
    // c = (y*z)%10
    // b = floor((y*z)/10) + (x*z)%10
    // a = floor((x*z)/10)
    for (var i = 0; i < this.arr.length; i++) {
      for (var j = 0, r = 0; j < numk.arr.length || r > 0; j++) {
        result[i + j] = (r += (result[i + j] || 0) + this.arr[i] * (numk.arr[j] || 0)) % 10
        r = Math.floor(r / 10)
      }
    }
    this.arr = result
    return this
  }
  // num - 1 
  sub1() {
    if (this.isZero()) return false
    for (var i = 0; i < this.arr.length; i++) {
      if (this.arr[i] != 0) {
        this.arr[i] -= 1
        for (i = i - 1; i >= 0; i--) {
          this.arr[i] = 9
        }
        return this
      }
    }
  }
  // num / 2
  div2() {
    if (this.arr[0] % 2 != 0) return false
    // start from front, divide each digit by 2
    var arrRev = this.arr.slice().reverse()
    var r = 0
    for (var i = 0; i < arrRev.length; i++) {
      if (r == 1) arrRev[i] += 10
      r = arrRev[i] % 2 == 0 ? 0 : 1
      arrRev[i] = Math.floor(arrRev[i] / 2)
    }
    this.arr = arrRev.reverse()
    return this
  }
  // remove leading 0s
  remove0() {
    var arrRev = this.arr.slice().reverse()
    var count = 0
    for (var i = 0; i < arrRev.length - 1; i++) {
      if (arrRev[i] == 0) count++
      else break
    }
    this.arr = this.arr.slice(count - 1, this.arr.length - 1)
    return this
  }
  // num ^ k
  pow(k) {
    var numk = new BigNum(k)
    var numo = new BigNum(this) // original number, for use when k is even
    this.arr = [1]
    while (!numk.isZero()) {
      if (numk.arr[0] % 2 != 0) {
        this.mult(numo)
        numk.sub1()
        continue
      } else {
        numo.mult(numo)
        numk.div2()
      }
    }
    return this
  }
}

// returns integer if finite and BigNum otherwise
var a = (m, n) => {
  if (m == 0) return n + 1
  else if (m == 1) return n + 2
  else if (m == 2) return 2 * n + 3
  else if (m == 3) return Math.pow(2, n + 3) - 3
  else if (m == 4) {
    // does not work at the moment, use direct exponent to calculate
    var bn = new BigNum(16)
    var num2 = new BigNum(2)
    for (var i = 0; i < n; i++) {
      bn = num2.pow(bn)
    }
    return bn.sub1().sub1().sub1()
  }
  else return false
}

var printBN = (bn) => {
  var revArr = bn.arr.reverse()
  revArr.forEach(e => {
    process.stdout.write(e + '')
  })
}

//printBN(a(4, 0)) // 13
//printBN(a(4, 1)) // 65533
//printBN(a(4, 2)) // huge number
//printBN(a(4, 3)) // impossibru


printBN(new BigNum(2).pow(new BigNum(65536)))
//printBN(new BigNum(2).pow(new BigNum(2).pow(new BigNum(65536))))