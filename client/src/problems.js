[
    {
        "id": 1,
        "title": "Sum of Two Numbers",
        "description": "Write a function to return the sum of two numbers.",
        "testCases": [
            { "input": "1 2", "output": "3" },
            { "input": "5 10", "output": "15" }
        ],
        "defaultCode": {
            "java": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int a = scanner.nextInt();\n        int b = scanner.nextInt();\n        System.out.println(sum(a, b));\n    }\n\n    public static int sum(int a, int b) {\n        // Write your code here\n        return 0;\n    }\n}",
            "javascript": "function sum(a, b) {\n    // Write your code here\n    return 0;\n}\n\nconst readline = require('readline').createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\nreadline.question('', (input) => {\n    const [a, b] = input.split(' ').map(Number);\n    console.log(sum(a, b));\n    readline.close();\n});",
            "cpp": "#include <iostream>\nusing namespace std;\n\nint sum(int a, int b) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << sum(a, b) << endl;\n    return 0;\n}",
            "python": "def sum(a, b):\n    # Write your code here\n    return 0\n\nif __name__ == \"__main__\":\n    a, b = map(int, input().split())\n    print(sum(a, b))"
        }
    },
    {
        "id": 2,
        "title": "Multiply Two Numbers",
        "description": "Write a function to return the product of two numbers.",
        "testCases": [
            { "input": "2 3", "output": "6" },
            { "input": "4 5", "output": "20" }
        ],
        "defaultCode": {
            "java": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int a = scanner.nextInt();\n        int b = scanner.nextInt();\n        System.out.println(multiply(a, b));\n    }\n\n    public int multiply(int a, int b) {\n        // Write your code here\n        return 0;\n    }\n}",
            "javascript": "function multiply(a, b) {\n    // Write your code here\n    return 0;\n}\n\nconst readline = require('readline').createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\nreadline.question('', (input) => {\n    const [a, b] = input.split(' ').map(Number);\n    console.log(multiply(a, b));\n    readline.close();\n});",
            "cpp": "#include <iostream>\nusing namespace std;\n\nint multiply(int a, int b) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << multiply(a, b) << endl;\n    return 0;\n}",
            "python": "def multiply(a, b):\n    # Write your code here\n    return 0\n\nif __name__ == \"__main__\":\n    a, b = map(int, input().split())\n    print(multiply(a, b))"
        }
    }
]
