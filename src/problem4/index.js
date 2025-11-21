function sum_to_n_iteration(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    };
    return sum;
}

console.log(sum_to_n_iteration(10));//55
