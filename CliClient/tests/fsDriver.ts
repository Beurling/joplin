import FsDriverNode from 'lib/fs-driver-node';
import shim from 'lib/shim';
const { expectThrow } = require('test-utils.js');

// On Windows, path.resolve is going to convert a path such as
// /tmp/file.txt to c:\tmp\file.txt
function platformPath(path:string) {
	if (shim.isWindows()) {
		return `C:${path.replace(/\//g, '\\')}`;
	} else {
		return path;
	}
}

describe('fsDriver', function() {

	it('should resolveRelativePathWithinDir', () => {
		const fsDriver = new FsDriverNode();
		expect(fsDriver.resolveRelativePathWithinDir('/test/temp', './my/file.txt')).toBe(platformPath('/test/temp/my/file.txt'));
		expect(fsDriver.resolveRelativePathWithinDir('/', './test')).toBe(platformPath('/test'));
		expect(fsDriver.resolveRelativePathWithinDir('/test', 'myfile.txt')).toBe(platformPath('/test/myfile.txt'));
		expect(fsDriver.resolveRelativePathWithinDir('/test/temp', './mydir/../test.txt')).toBe(platformPath('/test/temp/test.txt'));

		expectThrow(() => fsDriver.resolveRelativePathWithinDir('/test/temp', '../myfile.txt'));
		expectThrow(() => fsDriver.resolveRelativePathWithinDir('/test/temp', './mydir/../../test.txt'));
		expectThrow(() => fsDriver.resolveRelativePathWithinDir('/test/temp', '/var/local/no.txt'));
	});

});
