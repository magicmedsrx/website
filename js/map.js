async function initializeMap() {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

	svg.setAttribute('id', 'map');
	svg.setAttribute('height', '650');
	svg.setAttribute('viewBox', '0 0 965 600');
	svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
	svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
	svg.setAttribute('preserveAspectRatio', 'xMinYMin');

	const statesJSONLocation = '../map/states.json?v=0.1.0';
	const states = await statesFromJSON(statesJSONLocation);

	if (!states) {
		const stateName = document.getElementById('stateName');
		stateName.textContent = 'Failed to load the map data.';
		return;
	}

	states.forEach((state) => {
		const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		group.setAttribute('class', 'state');
		group.setAttribute('id', state.abbr);

		const path = mkState(state.shape);
		group.appendChild(path);

		if (state.path_start) {
			let path = mkPath(state.path_start, state.abbr_loc);
			group.appendChild(path);

			let rect = mkRect(state.abbr_loc.x, state.abbr_loc.y);
			group.appendChild(rect);
		}

		if (state.abbr_loc) {
			let text = mkText(state.abbr_loc.x, state.abbr_loc.y, state.abbr);
			group.appendChild(text);
		}

		let currentActiveState = null;
		let currentHoveredState = null;

		const toggleClasses = (state, add, className) => {
			if (!state) return;

			state.querySelectorAll('path').forEach((path) => {
				path.classList.toggle(className, add);
			});
		};

		const activateHoverState = (newState) => {
			if (currentActiveState) return;

			if (currentHoveredState && currentHoveredState !== newState) {
				toggleClasses(currentHoveredState, false, 'hovered');
			}

			toggleClasses(newState, true, 'hovered');
			currentHoveredState = newState;
		};

		const deactivateHoverState = () => {
			if (currentHoveredState) {
				toggleClasses(currentHoveredState, false, 'hovered');
				currentHoveredState = null;
			}
		};

		const activateActiveState = (newState) => {
			const allStates = document.querySelectorAll('.state');
			allStates.forEach((state) => {
				toggleClasses(state, false, 'active');
			});

			toggleClasses(newState, true, 'active');

			const stateInfo = document.getElementById('stateName');
			stateInfo.textContent = state.name;

			const stateLink = document.getElementById('stateLinks');
			stateLink.textContent = '';

			state.links.forEach((link) => {
				const div = document.createElement('div');

				const a = document.createElement('a');
				a.href = link.link;
				a.textContent = link.name;
				div.appendChild(a);

				const br = document.createElement('br');
				div.appendChild(br);

				stateLink.appendChild(div);
			});

			if (state.notes) {
				const stateNotes = document.createElement('p');
				stateNotes.textContent = state.notes;
				stateLink.appendChild(stateNotes);
			}

			currentActiveState = newState;
		};

		const handleInteraction = (event) => {
			const newActiveState = document.getElementById(state.abbr);

			switch (event.type) {
				case 'mouseover':
					activateHoverState(newActiveState);
					break;
				case 'mouseout':
					deactivateHoverState();
					break;
				case 'touchstart':
				case 'click':
					activateActiveState(newActiveState);
					break;
			}
		};

		const handleDocumentClick = (e) => {
			const newActiveState = document.getElementById(state.abbr);
			if (!newActiveState.contains(e.target) && currentActiveState) {
				toggleClasses(currentActiveState, false, 'active');
				currentActiveState = null;
			}
		};

		const addInteractionEvents = (element) => {
			element.addEventListener('mouseover', handleInteraction);
			element.addEventListener('mouseout', handleInteraction);
			element.addEventListener('touchstart', handleInteraction);
			element.addEventListener('click', handleInteraction);
			element.addEventListener('touchend', (e) => e.preventDefault());
		};

		svg.addEventListener('click', handleDocumentClick);
		addInteractionEvents(group);

		svg.appendChild(group);
	});

	const container = document.getElementById('mapContainer');
	container.appendChild(svg);
}

function mkState(shape) {
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('d', shape);
	path.setAttribute('class', 'state');

	path.setAttribute('stroke', 'black');

	return path;
}

function mkRect(x, y) {
	const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	const width = 20;
	const height = 13;

	rect.setAttribute('x', x);
	rect.setAttribute('y', y - height);
	rect.setAttribute('width', width);
	rect.setAttribute('height', height);
	rect.setAttribute('fill', '#efdecd');

	return rect;
}

function mkPath(start, end) {
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('d', `M${start.x},${start.y}L${end.x + 10},${end.y - 5}`);
	path.setAttribute('stroke', 'black');

	return path;
}

function mkText(x, y, abbr) {
	const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	textElement.setAttribute('x', x);
	textElement.setAttribute('y', y);
	textElement.setAttribute('class', 'abbrText');
	textElement.textContent = abbr;

	return textElement;
}

async function statesFromJSON(filePath) {
	try {
		const response = await fetch(filePath);

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Failed to fetch the JSON file:', error);
		return null;
	}
}
