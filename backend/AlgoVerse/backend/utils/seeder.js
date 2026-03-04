const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('../models/Problem');

// Load env vars
dotenv.config({ path: './.env' }); // Look in current directory (backend)

const problems = [
    {
        title: 'Two Sum',
        slug: 'two-sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'Easy',
        topic: 'Arrays',
        tags: ['Array', 'Hash Table'],
        companies: ['Google', 'Amazon', 'Meta'],
        constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
        examples: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
            { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
        ],
        testCases: [
            { input: '2\n4\n2 7 11 15\n9', output: '0 1', isHidden: false },
            { input: '2\n3\n3 2 4\n6', output: '1 2', isHidden: false }
        ],
        starterCode: {
            javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};',
            python: 'class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass',
            java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}',
            cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};',
            c: '/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    \n}'
        },
        xpReward: 20,
        order: 1,
        hints: [
            "A brute force approach would be to iterate through the array with two nested loops.",
            "Can you do it in one pass using a hash map?"
        ]
    },
    {
        title: 'Reverse String',
        slug: 'reverse-string',
        description: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.',
        difficulty: 'Easy',
        topic: 'Strings',
        tags: ['Two Pointers', 'String'],
        companies: ['Apple', 'Microsoft'],
        constraints: '1 <= s.length <= 10^5\ns[i] is a printable ascii character.',
        examples: [
            { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: '' }
        ],
        testCases: [
            { input: '5\nh e l l o', output: 'o l l e h', isHidden: false }
        ],
        starterCode: {
            javascript: '/**\n * @param {character[]} s\n * @return {void} Do not return anything, modify s in-place instead.\n */\nvar reverseString = function(s) {\n    \n};',
            python: 'class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        """\n        Do not return anything, modify s in-place instead.\n        """\n        pass',
            java: 'class Solution {\n    public void reverseString(char[] s) {\n        \n    }\n}',
            cpp: 'class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        \n    }\n};',
            c: 'void reverseString(char* s, int sSize) {\n    \n}'
        },
        xpReward: 15,
        order: 2,
        hints: [
            "Think about using two pointers, one at the start and one at the end.",
            "Swap the characters at the pointers and move them towards the center."
        ]
    },
    {
        title: 'Valid Parentheses',
        slug: 'valid-parentheses',
        description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
        difficulty: 'Easy',
        topic: 'Stack',
        tags: ['Stack', 'String'],
        companies: ['Facebook', 'Google', 'Amazon'],
        constraints: '1 <= s.length <= 10^4\ns consists of parentheses only "()[]{}"',
        examples: [
            { input: 's = "()"', output: 'true', explanation: '' },
            { input: 's = "()[]{}"', output: 'true', explanation: '' },
            { input: 's = "(]"', output: 'false', explanation: '' }
        ],
        testCases: [
            { input: '"()"', output: 'true', isHidden: false },
            { input: '"()[]{}"', output: 'true', isHidden: false },
            { input: '"(]"', output: 'false', isHidden: false },
            { input: '"([)]"', output: 'false', isHidden: true },
            { input: '"{[]}"', output: 'true', isHidden: true }
        ],
        starterCode: {
            javascript: '/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};',
            python: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        pass',
            java: 'class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}',
            cpp: 'class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};',
            c: 'bool isValid(char* s) {\n    \n}'
        },
        xpReward: 30,
        order: 3,
        hints: [
            "Use a stack to keep track of opening brackets.",
            "When you see a closing bracket, check if it matches the top of the stack.",
            "If the stack is empty or doesn't match, return false."
        ]
    },
    {
        title: 'Best Time to Buy and Sell Stock',
        slug: 'best-time-to-buy-and-sell-stock',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
        difficulty: 'Easy',
        topic: 'Arrays',
        tags: ['Array', 'Dynamic Programming'],
        companies: ['Uber', 'Microsoft', 'Goldman Sachs'],
        constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
        examples: [
            { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
            { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and the max profit = 0.' }
        ],
        testCases: [
            { input: '6\n7 1 5 3 6 4', output: '5', isHidden: false },
            { input: '5\n7 6 4 3 1', output: '0', isHidden: false },
            { input: '2\n2 4', output: '2', isHidden: true },
            { input: '3\n2 1 2', output: '1', isHidden: true }
        ],
        starterCode: {
            javascript: '/**\n * @param {number[]} prices\n * @return {number}\n */\nvar maxProfit = function(prices) {\n    \n};',
            python: 'class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        pass',
            java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}',
            cpp: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};',
            c: 'int maxProfit(int* prices, int pricesSize) {\n    \n}'
        },
        xpReward: 35,
        order: 4,
        hints: [
            "You want to buy low and sell high.",
            "Keep track of the minimum price encountered so far.",
            "At each step, calculate the profit if you sold today (current price - min price)."
        ]
    },
    {
        title: 'Climbing Stairs',
        slug: 'climbing-stairs',
        description: 'You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        difficulty: 'Easy',
        topic: 'Dynamic Programming',
        tags: ['Math', 'Dynamic Programming', 'Memoization'],
        companies: ['Adobe', 'Apple'],
        constraints: '1 <= n <= 45',
        examples: [
            { input: 'n = 2', output: '2', explanation: '1. 1 step + 1 step\n2. 2 steps' },
            { input: 'n = 3', output: '3', explanation: '1. 1+1+1\n2. 1+2\n3. 2+1' }
        ],
        testCases: [
            { input: '2', output: '2', isHidden: false },
            { input: '3', output: '3', isHidden: false },
            { input: '4', output: '5', isHidden: true },
            { input: '5', output: '8', isHidden: true },
            { input: '10', output: '89', isHidden: true }
        ],
        starterCode: {
            javascript: '/**\n * @param {number} n\n * @return {number}\n */\nvar climbStairs = function(n) {\n    \n};',
            python: 'class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass',
            java: 'class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}',
            cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};',
            c: 'int climbStairs(int n) {\n    \n}'
        },
        xpReward: 30,
        order: 5,
        hints: [
            "To reach step n, you could have come from step n-1 or n-2.",
            "Does this look like the Fibonacci sequence?",
            "Base cases: step 1 has 1 way, step 2 has 2 ways."
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        await Problem.deleteMany({});
        console.log('Problems Cleared');

        await Problem.insertMany(problems);
        console.log('Problems Seeded');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
