export default class IO {
	public static clear (): void {
		console.clear();
	}

	public static out (string: string, ...more: string[]): void {
		console.log(string, ...more);
	}
}
