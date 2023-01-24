var maximumTop = function(nums, k) {
    const removedEls = nums.splice(0, k);
    const leftedEls = nums.splice(k);

    console.log(removedEls);
    console.log(leftedEls);
    return Math.max(...removedEls)
};


console.log(maximumTop([5, 2, 2, 4, 0, 6], 4));