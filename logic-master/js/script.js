/* TODO:
Saving to local memory
Full subtractor button
Ability to delete nodes
Styling
Light mode / dark mode

DONE:
Untriggered nodes should have no colour DONE
single connection nodes should have more consistent styling DONE

*/
windowWidth = $(window).width();
windowHeight = $(window).height();

var truthtables = {
	AND: ['000', '010', '100', '111'],
	NAND: ['001', '011', '101', '110'],
	OR: ['000', '011', '101', '111'],
	XOR: ['000', '011', '101', '110'],
	XNOR: ['001', '010', '100', '111'],
	NOT: ['10', '01'],
	NOR: ['001', '010', '100', '110'],
};

function truthTable(nodeType) {
	if (nodeType == 'INPUT' || nodeType == 'OUTPUT') {
		return;
	}
	$('#truth-table').show().find('h2').html(nodeType + ' truth table');
	$('#truth-table p *').remove();
	var truth = truthtables[nodeType];

	for (var i = 0; i < truth.length; i++) {
		if (nodeType == 'NOT') {
			var span1 = $('<span></span>').html(truth[i][0]);
			var span2 = $('<span></span>').html('=');
			var span3 = $('<span></span>').html(truth[i][1]);
			$('#truth-table p').append(span1).append(span2).append(span3).append('<br />');
		} else {
			var span1 = $('<span></span>').html(truth[i][0]);
			var span2 = $('<span></span>').html(truth[i][1]);
			var span3 = $('<span></span>').html('=');
			var span4 = $('<span></span>').html(truth[i][2]);
			$('#truth-table p').append(span1).append(span2).append(span3).append(span4).append('<br />');
		}
	}
}

/* RANDOM */
function randomNumber(type, min, max, not) {
	var r = (type == 'int') ? Math.floor(Math.random() * (max - min + 1)) + min : (Math.random() * (max - min) + min).toFixed(1);
	if (!not) {
		return r;
	} else {
		return not == r ? randomNumber(type, min, max, not) : r;
	}
}

function randomColor() {
	var h = randomNumber('int', 0, 360);
	var s = randomNumber('int', 42, 98);
	var l = randomNumber('int', 40, 90);
	return `hsl(${h},${s}%,${l}%)`;
}

/* LOGIC GATES */

function XOR(a, b) {
	a = Number(a);
	b = Number(b);
	return a ^ b;
}

function AND(a, b) {
	a = Number(a);
	b = Number(b);
	return a && b;
}

function OR(a, b) {
	a = Number(a);
	b = Number(b);
	return (a | b) ? 1 : 0;
}

function NOT(a) {
	a = Number(a);
	return (a !== 1) ? 1 : 0;
}

function NOR(a, b) {
	return NOT(OR(a, b));
}

function NAND(a, b) {
	return NOT(AND(a, b));
}

function XNOR(a, b) {
	return NOT(XOR(a, b));
}

/* NODES */

function generateNodeName() {
	var c = 'bcdfghjklmnpqrstvwxyz'.split('');
	var v = 'aeiou'.split('');
	
	var id = c[randomNumber('int', 0, c.length - 1)]
	+ v[randomNumber('int', 0, v.length - 1)]
	+ c[randomNumber('int', 0, c.length - 1)]
	+ v[randomNumber('int', 0, v.length - 1)];
	
	if (findNode(id).length > 0) return generateNodeName();
	return id;
}

function createNode(nodeType) {
	var nodeName = generateNodeName();
	
	var div = $('<div></div>')
	.addClass('node')
	.attr('nodeName', nodeName)
	.attr('nodeType', nodeType);
	
	var nodeInput1 = $('<span></span>')
	.addClass('nodeInput')
	.attr('nodeInputIndex', '0')
	.attr('nodeColor', randomColor());
	
	var nodeInput2 = $('<span></span>')
	.addClass('nodeInput')
	.attr('nodeInputIndex', '1')
	.attr('nodeColor', randomColor());
	
	var nodeOutput = $('<span></span>')
	.addClass('nodeOutput');
	
	var span1 = $('<span></span>')
	.addClass('nodeName')
	.html(nodeName);
	
	var span2 = $('<span></span>')
	.html(nodeType);
	
	div.append(nodeInput1).append(nodeInput2).append(nodeOutput).append(span1).append(span2);
	$('#logic').append(div);
	
	div.on('click', function () {
		if ($('#deleteButton').attr('class') == 'active') {
			$('[nodeInputFrom="' + $(this).attr('nodeName') + '"]').removeAttr('nodeInputFrom');
			$('#deleteButton').removeClass('active');
			$(this).remove();
		}
	});
	
	div.on('dblclick', function () {
		if ($(this).attr('nodeType') == 'INPUT') {
			var binary = ($(this).attr('nodeBinary') == '0') ? '1' : '0';
			$(this).attr('nodeBinary', binary);
		}
	});
	
	div.on('mouseover', function () {
		var nodeType = $(this).attr('nodeType');
		truthTable(nodeType);
	});
	
	div.on('mouseout', function () {
		$('#truth-table').hide();
	});
	
	div.find('.nodeInput').on('click', function (e) {
		$(this).removeAttr('nodeInputFrom');
	});
	
	div.find('.nodeOutput').on('mousedown', function (e) {
		$('#connector-point').attr('connectorFrom', $(this).parent().attr('nodeName'));
	});
	
	$(document).on('mouseup', function (e) {
		$('#connector-point').removeAttr('connectorFrom');
	});
	
	div.find('.nodeInput').on('mouseup', function () {
		var nodeInputFrom = $('#connector-point').attr('connectorFrom');
		$(this).attr('nodeInputFrom', nodeInputFrom);
		
	});
	
	div.draggable({ cancel: '.nodeOutput, .nodeInput'}).css({
		left: $('input[type="button"][value="' + nodeType + '"]')[0].getBoundingClientRect().left,
		top: window.scrollY + $('input[type="button"][value="' + nodeType + '"]')[0].getBoundingClientRect().top + 120
	});
	return div;
}

function findNode(nodeName) {
	return $('.node[nodeName="' + nodeName + '"]');
}

function connectNodes(elementName1, elementName2, nodeIndex) {
	// connectNodes('momo', 'baka', 1);
	var element1 = findNode(elementName1);
	findNode(elementName2).find('.nodeInput').eq(nodeIndex).attr('nodeInputFrom', elementName1);
}

/* RUN THE SHOW */

function runConnections() {
	$('#outputResults').val('');
	$('.node').each(function (i) {
		var nodeType = $(this).attr('nodeType');
		var nodeInput1 = $(this).find('.nodeInput').eq(0).attr('nodeInputFrom');
		var nodeInput2 = $(this).find('.nodeInput').eq(1).attr('nodeInputFrom');
		
		var nodeInputFrom1 = findNode(nodeInput1).attr('nodeBinary');
		var nodeInputFrom2 = findNode(nodeInput2).attr('nodeBinary');
		
		if (nodeType == 'INPUT') {
			$(this).attr('nodeBinary', nodeInputFrom1);
			return;
		} else if (nodeType == 'NOT') {
			if (!nodeInputFrom1) {
				$(this).removeAttr('nodeBinary');
				return;
			}
			$(this).attr('nodeBinary', NOT(nodeInputFrom1));
			return;
		} else if (nodeType == 'OUTPUT') {
			if (!nodeInputFrom1) {
				$(this).removeAttr('nodeBinary');
				return;
			}
			$(this).attr('nodeBinary', nodeInputFrom1);
			$('#outputResults').val($('#outputResults').val() + nodeInputFrom1);
		} else {
			if (!nodeInputFrom1 || !nodeInputFrom2) {
				$(this).removeAttr('nodeBinary');
				return;
			}
		}
		if (nodeType == 'XOR') {
			var result = XOR(nodeInputFrom1, nodeInputFrom2);
		} else if (nodeType == 'AND') {
			var result = AND(nodeInputFrom1, nodeInputFrom2);
		} else if (nodeType == 'OR') {
			var result = OR(nodeInputFrom1, nodeInputFrom2);
		} else if (nodeType == 'NAND') {
			var result = NAND(nodeInputFrom1, nodeInputFrom2);
		} else if (nodeType == 'XNOR') {
			var result = XNOR(nodeInputFrom1, nodeInputFrom2);
		} else if (nodeType == 'NOR') {
			var result = NOR(nodeInputFrom1, nodeInputFrom2);
		}
		$(this).attr('nodeBinary', result);
	});
}

/* PRESETS */

function fullAdder() {
	var input1 = createNode('INPUT');
	var input2 = createNode('INPUT');
	var input3 = createNode('INPUT');
	var xor1 = createNode('XOR');
	var xor2 = createNode('XOR');
	var output = createNode('OUTPUT');
	var and1 = createNode('AND');
	var and2 = createNode('AND');
	var or = createNode('OR');
	
	input1.css({ left: 22, top: window.scrollY + 150 }).dblclick();
	input2.css({ left: 22, top: window.scrollY + 250 }).dblclick();
	input3.css({ left: 22, top: window.scrollY + 350 }).dblclick();
	
	xor1.css({ left: windowWidth / 3, top: window.scrollY + 150 });
	connectNodes(input1.attr('nodeName'), xor1.attr('nodeName'), 0);
	connectNodes(input2.attr('nodeName'), xor1.attr('nodeName'), 1);
	
	xor2.css({ left: windowWidth - 550, top: window.scrollY + 150 });
	connectNodes(xor1.attr('nodeName'), xor2.attr('nodeName'), 0);
	connectNodes(input3.attr('nodeName'), xor2.attr('nodeName'), 1);
	
	output.css({ left: windowWidth - 250, top: window.scrollY + 150 });
	connectNodes(xor2.attr('nodeName'), output.attr('nodeName'), 0);
	
	and1.css({ left: windowWidth / 2, top: window.scrollY + 250 });
	connectNodes(xor1.attr('nodeName'), and1.attr('nodeName'), 0);
	connectNodes(input3.attr('nodeName'), and1.attr('nodeName'), 1);
	
	and2.css({ left: windowWidth / 3, top: window.scrollY + 350 });
	connectNodes(input1.attr('nodeName'), and2.attr('nodeName'), 0);
	connectNodes(input2.attr('nodeName'), and2.attr('nodeName'), 1);
	
	or.css({ left: windowWidth - 450, top: window.scrollY + 350 });
	connectNodes(and1.attr('nodeName'), or.attr('nodeName'), 0);
	connectNodes(and2.attr('nodeName'), or.attr('nodeName'), 1);
}

function fullSubtractor() {
	var input1 = createNode('INPUT');
	var input2 = createNode('INPUT');
	var input3 = createNode('INPUT');
	var xor1 = createNode('XOR');
	var xor2 = createNode('XOR');
	var not1 = createNode('NOT');
	var not2 = createNode('NOT');
	var output = createNode('OUTPUT');
	var and1 = createNode('AND');
	var and2 = createNode('AND');
	var or = createNode('OR');
	
	input1.css({ left: 22, top: window.scrollY + 150 }).dblclick();
	input2.css({ left: 22, top: window.scrollY + 250 }).dblclick();
	input3.css({ left: 22, top: window.scrollY + 350 }).dblclick();
	
	xor1.css({ left: windowWidth / 3, top: window.scrollY + 150 });
	connectNodes(input1.attr('nodeName'), xor1.attr('nodeName'), 0);
	connectNodes(input2.attr('nodeName'), xor1.attr('nodeName'), 1);
	
	xor2.css({ left: windowWidth - 550, top: window.scrollY + 150 });
	connectNodes(xor1.attr('nodeName'), xor2.attr('nodeName'), 0);
	connectNodes(input3.attr('nodeName'), xor2.attr('nodeName'), 1);
	
	output.css({ left: windowWidth - 250, top: window.scrollY + 150 });
	connectNodes(xor2.attr('nodeName'), output.attr('nodeName'), 0);
	
	not1.css({ left: 300, top: window.scrollY + 250 });
	connectNodes(input1.attr('nodeName'), not1.attr('nodeName'), 0);
	
	not2.css({ left: windowWidth / 2.5, top: window.scrollY + 250 });
	connectNodes(xor1.attr('nodeName'), not2.attr('nodeName'), 0);
	
	and1.css({ left: windowWidth / 2, top: window.scrollY + 250 });
	connectNodes(not2.attr('nodeName'), and1.attr('nodeName'), 0);
	connectNodes(input3.attr('nodeName'), and1.attr('nodeName'), 1);
	
	and2.css({ left: windowWidth / 3, top: window.scrollY + 350 });
	connectNodes(not1.attr('nodeName'), and2.attr('nodeName'), 0);
	connectNodes(input2.attr('nodeName'), and2.attr('nodeName'), 1);
	
	or.css({ left: windowWidth - 450, top: window.scrollY + 350 });
	connectNodes(and1.attr('nodeName'), or.attr('nodeName'), 0);
	connectNodes(and2.attr('nodeName'), or.attr('nodeName'), 1);
}

/* INTERVALS AND TRIGGERS */

$(document).on('mousemove', function (e) {
	var connectorFrom = $('#connector-point').attr('connectorFrom');
	if (connectorFrom) {
		$('.line').remove();
		$('#connector-point').css({ top: e.pageY - 5, left: e.pageX - 10, position: 'absolute' });
		drawLine(findNode(connectorFrom).find('.nodeOutput'), $('#connector-point'));
	}
});

$(document).ready(function() {
	$(document).on('scroll', function() {
		if ($(window).scrollTop() + $(window).height() >= $(document).height() - 10) {
			$('body').css({ height: parseInt($('body').css('height'), 0) + 300 + 'px' });
		}
	});
});

$('#deleteButton').on('click', function () {
	$(this).toggleClass('active');
});

/* OTHER */

//fullAdder();
//fullSubtractor();

function drawLine(element1, element2) {
	var x1 = element1.offset().left;
	var y1 = element1.offset().top;
	
	var x2 = element2.offset().left;
	var y2 = element2.offset().top;
	
	var angle = angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
	var distance = (Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)) - 15;
	
	$('<div></div>').attr('class', 'line').css({
		'transform': 'rotate(' + angle + 'deg) translate(0, -100%)',
		'transform-origin': '0% 0%',
		left: x1 + 15,
		top: y1 + 10,
		width: distance
	}).appendTo('#logic');
}

function redrawLines() {
	$('.line').remove();
	var nodeInputs = $('.nodeInput');
	for (var i = 0; i < nodeInputs.length; i++) {
		var nodeInputFrom1 = nodeInputs.eq(i).attr('nodeInputFrom');
		if (nodeInputFrom1) {
			var element1 = findNode(nodeInputFrom1).find('.nodeOutput');
			var element2 = nodeInputs.eq(i);
			drawLine(element1, element2);
		}
	}
}

setInterval(function () {
	var connectorFrom = $('#connector-point').attr('connectorFrom');
	if (!connectorFrom) {
		runConnections();
		redrawLines();
	}
}, 500);

fullAdder();