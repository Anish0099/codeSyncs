export const languageMap = {
    "cpp": {
        id: 54,
        defaultCode:
            "#include <iostream>\n"
            + "using namespace std;\n\n"
            + "int main() {\n"
            + '\tcout << "Hello World!";\n'
            + "\treturn 0;\n"
            + "}",
    },
    "java": {
        id: 62,
        defaultCode: `public class Main {
            public static void main(String[] args) {
                System.out.println("Hello World!");
            }
    }`,
    },
    "python": {
        id: 71,
        defaultCode: `print("Hello World!")`,
    },
    "javascript": {
        id: 63,
        defaultCode: `console.log("Hello World!");`,
    }
}