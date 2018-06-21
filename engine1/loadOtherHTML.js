/**
 * 
 * @param {string} from path to html file (will load #content)
 * @param {HTMLElement} to the element will be contain the html
 */
async function loadHTML(from, to)
{
	if (typeof(from) != "string") {
		throw new Error("Khong tim thay duong dan");
	}

	const res = await fetch(from);
	if (!res.ok) {
		throw new Error(res.statusText);
	}

	const htmlData = await res.text();
	const htmlReceive = document.createElement('div');
	htmlReceive.innerHTML = htmlData;

	const htmlContain = htmlReceive.querySelector('#content');
	const htmlScript = htmlReceive.querySelector('#content-script');
	
	if (!htmlContain) {
		throw new Error("Khong tim thay #content trong file " + from);
	}
	
	to.innerHTML = htmlContain.innerHTML;

	if (htmlScript && htmlScript.src) {
		const scriptThatCanRun = document.createElement('script');
		to.appendChild(scriptThatCanRun);
		scriptThatCanRun.src = htmlScript.src;
	}
}