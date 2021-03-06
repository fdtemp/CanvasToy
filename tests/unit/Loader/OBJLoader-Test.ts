namespace Testing {

    class OBJLoaderIm extends CanvasToy.OBJLoader {
        public static testRegulars() {
            let pattern: RegExp, str: string;
            describe("commentPattern", () => {
                beforeEach(() => {
                    pattern = OBJLoaderIm.commentPattern;
                });
                it("should match '#' comments", () => {
                    str =
                    `# comment
                    not-comment
                    `;
                    expect(str.match(pattern)[0]).toBe("# comment");
                });
                it("should not match no-'#' comments", () => {
                    str =
                    `not-comment
                    not-comment
                    `;
                    expect(str.match(pattern)).toBe(null);
                });
            });
            describe("numberPattern", () => {
                beforeEach(() => {
                    pattern = OBJLoaderIm.numberPattern;
                });
                it("should match integers", () => {
                    str = "5";
                    expect(str.match(pattern)[0]).toBe("5");
                });
                it("should match anti-integers", () => {
                    str = "-5";
                    expect(str.match(pattern)[0]).toBe("-5");
                });
                it("should match floats", () => {
                    str = "-5.0";
                    expect(str.match(pattern)[0]).toBe("-5.0");
                });
                it("should match only numbers", () => {
                    str = "f-5.0 78/0.7";
                    let group = str.match(pattern);
                    expect(group[0]).toBe("-5.0");
                    expect(group[1]).toBe("78");
                    expect(group[2]).toBe("0.7");
                });
            });
            describe("faceSplitVertPattern", () => {
                beforeEach(() => {
                    pattern = OBJLoaderIm.faceSplitVertPattern;
                });
                it("should match spliters", () => {
                    str = "1 -4/-5 9//213 321 87/9/43";
                    let result = str.match(pattern);
                    expect(result[0]).toBe("1");
                    expect(result[1]).toBe("-4/-5");
                    expect(result[2]).toBe("9//213");
                    expect(result[3]).toBe("321");
                    expect(result[4]).toBe("87/9/43");
                });
            });
            describe("facePerVertPattern", () => {
                beforeEach(() => {
                    pattern = OBJLoaderIm.facePerVertPattern;
                });
                it("should split pos-only vertex", () => {
                    str = "1";
                    let result = str.match(pattern);
                    expect(result[1]).toBe("1");
                    expect(result[2]).toBe("");
                    expect(result[3]).toBe("");
                });
                it("should split pos-normal vertex", () => {
                    str = "1/3";
                    let result = str.match(pattern);
                    expect(result[1]).toBe("1");
                    expect(result[2]).toBe("3");
                    expect(result[3]).toBe("");
                });
                it("should split pos-uv vertex", () => {
                    str = "1//4";
                    let result = str.match(pattern);
                    expect(result[1]).toBe("1");
                    expect(result[2]).toBe("");
                    expect(result[3]).toBe("4");
                });
            });
            // TODO(Daniel): objectSplitPattern
            describe("vertexPattern", () => {
                beforeEach(() => {
                    pattern = OBJLoaderIm.vertexPattern;
                });
                it("should match vertex", () => {
                    str = `
                    v 0.2313 324 -78
                    1 2 4
                    `;
                    let result = str.match(pattern);
                    expect(result[0]).toBe("v 0.2313 324 -78");
                });
            });
            describe("normalPattern", () => {
                beforeEach(() => {
                    pattern = OBJLoaderIm.normalPattern;
                });
                it("should match normal", () => {
                    str = `
                    vn 0.2313 324 -78
                    1 2 4
                    `;
                    let result = str.match(pattern);
                    expect(result[0]).toBe("vn 0.2313 324 -78");
                });
            });
            describe("uvPattern", () => {
                beforeEach(() => {
                    pattern = OBJLoaderIm.uvPattern;
                });
                it("should match uv", () => {
                    str = `
                    vt 0.2313 324 -78
                    1 2 4
                    `;
                    let result = str.match(pattern);
                    expect(result[0]).toBe("vt 0.2313 324 -78");
                });
            });
            describe("indexPattern", () => {
                beforeEach(() => {
                    pattern = OBJLoaderIm.indexPattern;
                });
                it("should split pos-only vertex", () => {
                    str = `
                    f 1/2/3 2/3/4 4/5/6 7/8/9
                    1 2 4
                    `;
                    let result = str.match(pattern);
                    expect(result[0]).toBe("f 1/2/3 2/3/4 4/5/6 7/8/9");
                });
            });
        }
    }

    describe("OBJLoader Test", () => {
        OBJLoaderIm.testRegulars();
    });
}
