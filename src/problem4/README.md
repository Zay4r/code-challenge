## Three ways to sum to n

The First and eaiest way is looping

```javascript
  function sum_to_n_iteration(n) {
        let sum = 0;
        for (let i = 1; i <= n; i++) {
            sum += i;
        };
        return sum;
  }

```
## What if n is a very big number

will loop 1000 times if n is 1000 because its O(n)

not efficient for big data

## Second Way

We can use another way of looping calling Recursive.

It takes lesser time then iteration because 
there is no increment in the middle of the process like iteration.

It just skips current iteration and directly jumps to another iteration.

The first iteration's value, let's say 10, 
is waiting for the second's iteration's value to sum with him.

but the second is also waiting for the third, third is also waiting for the fourth. and so on.

```javascript
function sum_to_n_recursive(n) {

    if (n <= 1) return n; // break point

    //10 + ( 9 + ( 8 + ( 7 + ( 6 + ( 5 + ( 4 + ( 3 + ( 2 + (1) ) ) ) ) ) ) ) )
    return n + sum_to_n_recursive(n - 1); 
}
```
This way will surely face some performance issue when n got bigger.

Let me show you something that I remind of talking about iteration.

![Zuma Pro](./zuma.gif)


## Third Way

The most efficient way has to be no loop, and can be done with just pure calculation.

Its called Big-O notation.

### Mathimatical Formula

```javascript

1 + 2 + . . . + n  =  n(n + 1) / 2

```
### Coding
```javascript
function sum_to_n_math(n) {
    return (n * (n + 1)) / 2;
}
```


Look at this example, Here is what I means by calculation is faster.

```javascript
SELECT SUM(amount) FROM transactions; 
```

This way we don't need to fetch all row from transactions table and calculates all that amounts again.

Other usages are instead of fetching all rows from db, try to cut it down by Limit (pagination)

and having indexes on tables' primary keys.
