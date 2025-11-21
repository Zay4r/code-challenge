//will loop 1000 times if n is 1000
//not very efficient
function sum_to_n_iteration(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    };
    return sum;
}

console.log(sum_to_n_iteration(10));//55


//recursive
//looks better, but will face slow when n is high too
//lets say n = 10
function sum_to_n_recursive(n) {

    //base case
    //here n is still 10, not yet break point
    if (n <= 1) return n; // break point

    //here n is 10 + ( 9 + ( 8 + ( 7 + ( 6 + ( 5 + ( 4 + ( 3 + ( 2 + (1) ) ) ) ) ) ) ) )
    return n + sum_to_n_recursive(n - 1); //55
}

//best choice we have for this is not having to loop n times and get the right answer by calculation
//Big-O notation
//O(n)
function sum_to_n_math(n) {
    return (n * (n + 1)) / 2;
}

//Here are what I means by calculation is faster 
SELECT SUM(amount) FROM transactions; // this way we don't need to fetch all row from transaction table and calculates all that again

//other approaches are instead of fetching all rows from db, try to cut it down by Limit (pagination)
//and having indexes on tables' primary keys

