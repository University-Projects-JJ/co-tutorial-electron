package assets.java;

import java.io.BufferedWriter;
import java.io.FileWriter;

public class program {

	public static void main(String[] args) throws Exception {
		BufferedWriter bw = new BufferedWriter(
				new FileWriter(System.getProperty("user.dir") + "/assets/java/output.txt"));
		System.out.println("running java");

		bw.write("");
		for (int i = 0; i < 10; i++) {
			bw.append("pc " + i * 4 + "\n");
			bw.append("add r1, r2, r3\n");
			bw.append("r0 00000000000000000000000000000000 0\n");
			bw.append("r1 00000000000000000000000000000000 " + i * 2 + "\n");
			bw.append("r2 00000000000000000000000000000001 1\n");
			bw.append("r3 00000000000000000000000000000010 2\n");
			bw.append("r4 00000000000000000000000000000000 0\n");
			bw.append("r5 00000000000000000000000000000000 0\n");
			bw.append("r6 00000000000000000000000000000000 0\n");
			bw.append("r7 00000000000000000000000000000000 0\n");
			bw.append("r8 00000000000000000000000000000000 0\n");
			bw.append("mbr 00000000000000000000000000000000 0\n");
			bw.append("memory 0 0\n");
		}
		bw.close();
		System.out.println("done");
	}
}