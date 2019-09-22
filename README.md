### A function that calculates the [Ackermann function](https://en.wikipedia.org/wiki/Ackermann_function). 

Includes three different versions with optimations made along the way.
- v1: Simple version using recursion
- v2: Optimized using memoization
- v3: Optimized further with direct mathematics calculations. Since the result of A(4,2) is very long (See A42.txt), I created the class BigNum that stores huge numbers as an array of digits. Then, I implemented basic arithemetic operations needed to calculate A(4,2) using BigNum, including:
  - multiply
  - power
  - divide by two (used to calculate powers more efficiently)
  - subtract by one (also used to calculate powers)
  - remove leading 0s
  
  I did not have the time to implement a for-loop to calculate A(4,x) since it would require further optimization. However, using BigNum and explicit formula, I was able to calculate A(4,2). 
  
  Upon seeing the length of A(4,2), I realized that A(4,3) would be way too big for my computer to calculate (Perhaps a supercomputer could do so with a highly efficien algorithm?).
