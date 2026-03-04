export const algorithmList = [
    // Sorting
    // Sorting
    {
        id: 's1',
        name: 'Bubble Sort',
        category: 'Sorting',
        difficulty: 'Beginner',
        path: '/algorithms/sorting/bubble',
        description: 'Simple comparison-based sorting algorithm.',
        timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
        spaceComplexity: 'O(1)',
        useCases: ['Teaching purposes', 'Small datasets', 'Nearly sorted data']
    },
    {
        id: 's2',
        name: 'Insertion Sort',
        category: 'Sorting',
        difficulty: 'Beginner',
        path: '/algorithms/sorting/insertion',
        description: 'Builds the final sorted array one item at a time.',
        timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
        spaceComplexity: 'O(1)',
        useCases: ['Small datasets', 'Online sorting (data streams)', 'Nearly sorted data']
    },
    {
        id: 's3',
        name: 'Selection Sort',
        category: 'Sorting',
        difficulty: 'Beginner',
        path: '/algorithms/sorting/selection',
        description: 'Repeatedly finds the minimum element and puts it at the beginning.',
        timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
        spaceComplexity: 'O(1)',
        useCases: ['Memory constrained systems', 'Small lists', 'Cost of swapping is high']
    },
    {
        id: 's4',
        name: 'Merge Sort',
        category: 'Sorting',
        difficulty: 'Intermediate',
        path: '/algorithms/sorting/merge',
        description: 'Divide and conquer algorithm that divides array into halves.',
        timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
        spaceComplexity: 'O(n)',
        useCases: ['Linked Lists', 'Large datasets', 'External sorting']
    },
    {
        id: 's5',
        name: 'Quick Sort',
        category: 'Sorting',
        difficulty: 'Intermediate',
        path: '/algorithms/sorting/quick',
        description: 'Divide and conquer algorithm using a pivot element.',
        timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
        spaceComplexity: 'O(log n)',
        useCases: ['General purpose sorting', 'Arrays', 'Performance critical apps']
    },
    {
        id: 's6',
        name: 'Heap Sort',
        category: 'Sorting',
        difficulty: 'Advanced',
        path: '/algorithms/sorting/heap',
        description: 'Comparison-based sorting technique based on Binary Heap.',
        timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
        spaceComplexity: 'O(1)',
        useCases: ['Systems requiring constant space', 'Priority queues', 'Embedded systems']
    },

    // Searching
    {
        id: 'se1',
        name: 'Linear Search',
        category: 'Searching',
        difficulty: 'Beginner',
        path: '/algorithms/searching/linear',
        description: 'Sequentially checks each element of the list.',
        timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
        spaceComplexity: 'O(1)',
        useCases: ['Unsorted lists', 'Small datasets', 'One-off searches']
    },
    {
        id: 'se2',
        name: 'Binary Search',
        category: 'Searching',
        difficulty: 'Beginner',
        path: '/algorithms/searching/binary',
        description: 'Search a sorted array by repeatedly dividing the search interval in half.',
        timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
        spaceComplexity: 'O(1)',
        useCases: ['Sorted arrays', 'Large datasets', 'Repeated lookups']
    },
    { id: 'se3', name: 'Jump Search', category: 'Searching', difficulty: 'Intermediate', path: '/algorithms/searching/jump', description: 'Searching in sorted arrays by jumping ahead by fixed steps.' },

    // Graphs
    { id: 'g1', name: 'Breadth-First Search (BFS)', category: 'Graphs', difficulty: 'Intermediate', path: '/algorithms/graphs/bfs', description: 'Traverses the graph layerwise.' },
    { id: 'g2', name: 'Depth-First Search (DFS)', category: 'Graphs', difficulty: 'Intermediate', path: '/algorithms/graphs/dfs', description: 'Traverses the graph depthwise.' },
    { id: 'g3', name: 'Dijkstra\'s Algorithm', category: 'Graphs', difficulty: 'Advanced', path: '/algorithms/graphs/dijkstra', description: 'Finds the shortest paths between nodes in a graph.' },
    { id: 'g4', name: 'Bellman-Ford', category: 'Graphs', difficulty: 'Advanced', path: '/algorithms/graphs/bellman-ford', description: 'Computes shortest paths from a single source vertex to all other vertices.' },
    { id: 'g5', name: 'Prim\'s MST', category: 'Graphs', difficulty: 'Advanced', path: '/algorithms/graphs/prims', description: 'Greedy algorithm that finds a minimum spanning tree.' },

    // Trees
    { id: 't1', name: 'Binary Tree Traversals', category: 'Trees', difficulty: 'Beginner', path: '/algorithms/trees/traversals', description: 'Inorder, Preorder, and Postorder traversals.' },
    { id: 't2', name: 'AVL Tree', category: 'Trees', difficulty: 'Advanced', path: '/algorithms/trees/avl', description: 'Self-balancing binary search tree.' },
    { id: 't3', name: 'Red-Black Tree', category: 'Trees', difficulty: 'Advanced', path: '/algorithms/trees/rbt', description: 'Self-balancing binary search tree with color attributes.' },

    // DP
    { id: 'dp1', name: 'Knapsack Problem', category: 'Dynamic Programming', difficulty: 'Intermediate', path: '/algorithms/dp/knapsack', description: 'Combinatorial optimization problem.' },
    { id: 'dp2', name: 'Longest Common Subsequence', category: 'Dynamic Programming', difficulty: 'Advanced', path: '/algorithms/dp/lcs', description: 'Finds the longest subsequence present in given sequences.' },
    { id: 'dp3', name: 'Coin Change', category: 'Dynamic Programming', difficulty: 'Intermediate', path: '/algorithms/dp/coin-change', description: 'Number of ways to make change for a particular amount.' },

    // Greedy
    { id: 'gr1', name: 'Activity Selection', category: 'Greedy', difficulty: 'Intermediate', path: '/algorithms/greedy/activity-selection', description: 'Select maximum number of activities that can be performed.' },
    { id: 'gr2', name: 'Huffman Coding', category: 'Greedy', difficulty: 'Advanced', path: '/algorithms/greedy/huffman', description: 'Lossless data compression algorithm.' },
];
