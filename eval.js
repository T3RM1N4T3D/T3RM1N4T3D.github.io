function buildBlobWithScript(script) {
    var fullHTML = `<script src="index.js"></script>`;
    return new Promise((resolve, reject) => {
        webkitRequestFileSystem(TEMPORARY, 1024 * 1024 * 300, function (fs) {
            function writeFileInDirectory(dir, name, data) {
                return new Promise((resolve) => {
                    dir.getFile(name, { create: true }, function (entry) {
                        entry.createWriter(function (writer) {
                            writer.write(new Blob([data]));
                            writer.onwriteend = function () {
                                resolve(entry)
                            }
                        });
                    })
                })
            }
            function removeFileInDirectory(dir, name) {
                return new Promise(function (resolve) {
                    dir.getFile(name, { create: true }, function (entry) {
                        entry.remove(resolve);
                    })
                })
            }
            fs.root.getDirectory('evaluations', { create: true }, async function (entry) {
                await removeFileInDirectory(entry, 'index.js');
                var handle = await writeFileInDirectory(entry, 'index.js', script);
                resolve(handle.toURL());

            }, reject)
        }, reject)
    })
}

document.querySelector('button').onclick = async () => {
	var url = await buildBlobWithScript(document.querySelector('textarea').value);
	  
	let script = document.createElement("script");
	script.src = url;
	document.body.append(script);
};
