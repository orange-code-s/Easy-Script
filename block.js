const Blockly = window.Blockly;
const javascriptGenerator = Blockly && Blockly.JavaScript ? Blockly.JavaScript : null;

if (typeof window.registerFieldAngle === 'function') window.registerFieldAngle();
if (typeof window.registerFieldColour === 'function') window.registerFieldColour();

const COLORS = {
  EVENT: "#FF6B35",
  CONTROL: "#E63946",
  MOTION: "#4C97FF",
  CANVAS: "#9966FF",
  SENSING: "#2ECC71",
  SYSTEM: "#FF6680",
  COLOR: "#D35400"
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "when_start",
    message0: "when project starts",
    colour: COLORS.EVENT,
    nextStatement: null,
    tooltip: "Runs when the project starts"
  },
  {
    type: "when_closed",
    message0: "when window closed",
    colour: COLORS.EVENT,
    nextStatement: null,
    tooltip: "Runs before the window closes"
  },
  {
    type: "when_receive",
    message0: "when I receive %1",
    args0: [{ type: "input_value", name: "MSG", check: "String" }],
    colour: COLORS.EVENT,
    nextStatement: null,
    tooltip: "Runs when a broadcast message is received"
  },
  {
    type: "broadcast",
    message0: "broadcast %1",
    args0: [{ type: "input_value", name: "MSG", check: "String" }],
    colour: COLORS.EVENT,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Sends a message to all scripts"
  },
  {
    type: "when_key_pressed",
    message0: "when key %1 pressed",
    args0: [{ type: "input_value", name: "KEY", check: "String" }],
    colour: COLORS.EVENT,
    nextStatement: null,
    tooltip: "Runs when a specific key is pressed"
  },
  {
    type: "when_mouse_clicked",
    message0: "when mouse %1 clicked",
    args0: [
      {
        type: "field_dropdown",
        name: "BUTTON",
        options: [
          ["left", "left"],
          ["right", "right"],
          ["any", "any"]
        ]
      }
    ],
    colour: COLORS.EVENT,
    nextStatement: null,
    tooltip: "Runs when mouse button is clicked"
  },
  {
    type: "forever",
    message0: "forever %1",
    args0: [{ type: "input_statement", name: "DO" }],
    colour: COLORS.CONTROL,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Runs the code inside continuously"
  },
  {
    type: "wait_seconds",
    message0: "wait %1 seconds",
    args0: [{ type: "input_value", name: "SECS", check: "Number" }],
    colour: COLORS.CONTROL,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Pauses the script for specified seconds"
  },
  {
    type: "go_to",
    message0: "go to x: %1 y: %2",
    args0: [
      { type: "input_value", name: "X", check: "Number" },
      { type: "input_value", name: "Y", check: "Number" }
    ],
    colour: COLORS.MOTION,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Moves sprite to specified coordinates"
  },
  {
    type: "turn",
    message0: "turn %1 by %2 degrees",
    args0: [
      {
        type: "field_dropdown",
        name: "DIR",
        options: [
          ["↶ left", "-1"],
          ["↷ right", "1"]
        ]
      },
      { type: "input_value", name: "ANGLE", check: "Number" }
    ],
    colour: COLORS.MOTION,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Rotates sprite by specified degrees"
  },
  {
    type: "move_forward",
    message0: "move %1 steps",
    args0: [{ type: "input_value", name: "STEPS", check: "Number" }],
    colour: COLORS.MOTION,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Moves sprite forward in current direction"
  },
  {
    type: "change_x_by",
    message0: "change x by %1",
    args0: [{ type: "input_value", name: "DX", check: "Number" }],
    colour: COLORS.MOTION,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Changes X position by specified amount"
  },
  {
    type: "change_y_by",
    message0: "change y by %1",
    args0: [{ type: "input_value", name: "DY", check: "Number" }],
    colour: COLORS.MOTION,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Changes Y position by specified amount"
  },
  {
    type: "point_direction",
    message0: "point in direction %1",
    args0: [{ type: "input_value", name: "DIR", check: "Number" }],
    colour: COLORS.MOTION,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Points sprite in specified direction (0=right, 90=down)"
  },
  {
    type: "get_x",
    message0: "x position",
    output: "Number",
    colour: COLORS.MOTION,
    tooltip: "Returns current X position"
  },
  {
    type: "get_y",
    message0: "y position",
    output: "Number",
    colour: COLORS.MOTION,
    tooltip: "Returns current Y position"
  },
  {
    type: "get_direction",
    message0: "direction",
    output: "Number",
    colour: COLORS.MOTION,
    tooltip: "Returns current rotation angle"
  },
  {
    type: "angle_value",
    message0: "angle %1",
    args0: [{ type: "field_angle", name: "ANGLE", value: 90 }],
    output: "Number",
    colour: COLORS.MOTION,
    tooltip: "An angle value selector"
  },
  {
    type: "clear_canvas",
    message0: "clear canvas",
    colour: COLORS.CANVAS,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Clears all drawings from canvas"
  },
  {
    type: "set_pen",
    message0: "pen %1",
    args0: [
      {
        type: "field_dropdown",
        name: "STATE",
        options: [
          ["down ✓", "true"],
          ["up ✗", "false"]
        ]
      }
    ],
    colour: COLORS.CANVAS,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Sets whether pen draws when moving"
  },
  {
    type: "set_pen_color",
    message0: "set pen color to %1",
    args0: [{ type: "input_value", name: "COLOR", check: "String" }],
    colour: COLORS.CANVAS,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Sets the drawing color"
  },
  {
    type: "set_pen_size",
    message0: "set pen size to %1",
    args0: [{ type: "input_value", name: "SIZE", check: "Number" }],
    colour: COLORS.CANVAS,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Sets pen thickness in pixels"
  },
  {
    type: "change_pen_size",
    message0: "change pen size by %1",
    args0: [{ type: "input_value", name: "DSIZE", check: "Number" }],
    colour: COLORS.CANVAS,
    previousStatement: null,
    nextStatement: null,
    tooltip: "Changes pen thickness by specified amount"
  },
  {
    type: "is_key",
    message0: "key %1 is %2",
    args0: [
      { type: "input_value", name: "KEY", check: "String" },
      {
        type: "field_dropdown",
        name: "STATE",
        options: [
          ["down", "down"],
          ["pressed", "pressed"],
          ["released", "released"],
          ["up", "up"]
        ]
      }
    ],
    output: "Boolean",
    colour: COLORS.SENSING,
    tooltip: "Checks keyboard key state"
  },
  {
    type: "mouse_button_state",
    message0: "mouse %1 is %2",
    args0: [
      {
        type: "field_dropdown",
        name: "BUTTON",
        options: [
          ["left", "left"],
          ["right", "right"],
          ["any", "any"]
        ]
      },
      {
        type: "field_dropdown",
        name: "STATE",
        options: [
          ["down", "down"],
          ["pressed", "pressed"],
          ["released", "released"],
          ["up", "up"]
        ]
      }
    ],
    output: "Boolean",
    colour: COLORS.SENSING,
    tooltip: "Checks mouse button state"
  },
  {
    type: "mouse_x",
    message0: "mouse x",
    output: "Number",
    colour: COLORS.SENSING,
    tooltip: "Returns mouse X position"
  },
  {
    type: "mouse_y",
    message0: "mouse y",
    output: "Number",
    colour: COLORS.SENSING,
    tooltip: "Returns mouse Y position"
  },
  {
    type: "delta_time",
    message0: "ΔT",
    output: "Number",
    colour: COLORS.SYSTEM,
    tooltip: "Time since last frame in seconds"
  },
  {
    type: "fps",
    message0: "FPS",
    output: "Number",
    colour: COLORS.SYSTEM,
    tooltip: "Frames per second"
  },
  {
    type: "screen_width",
    message0: "screen width",
    output: "Number",
    colour: COLORS.SYSTEM,
    tooltip: "Canvas width in pixels"
  },
  {
    type: "screen_height",
    message0: "screen height",
    output: "Number",
    colour: COLORS.SYSTEM,
    tooltip: "Canvas height in pixels"
  },
  {
    type: "colour_value",
    message0: "colour %1",
    args0: [{ type: "field_colour", name: "COLOR", value: "#ff0000" }],
    output: "String",
    colour: COLORS.COLOR,
    tooltip: "A color value"
  }
]);

const JSG = javascriptGenerator;

const getNext = (block) => {
  const next = block.getNextBlock();
  if (!next) return "";
  const code = JSG.blockToCode(next);
  return Array.isArray(code) ? (code[0] || "") : (code || "");
};

const safeValueCode = (block, name, fallback = "0") => {
  const c = JSG.valueToCode(block, name, JSG.ORDER_NONE);
  return (typeof c === "string" && c.length) ? c : fallback;
};

const INIT_PREAMBLE = `
if (!window.__gs_initialized) {
  window.__gs_initialized = true;
  
  if (!window.canvas) {
    window.canvas = document.getElementById('canvas') || document.createElement('canvas');
    if (!document.body.contains(window.canvas)) {
      document.body.appendChild(window.canvas);
    }
  }
  
  window.ctx = window.canvas.getContext('2d');
  window.sprite = { x: 0, y: 0, rotation: 0, penDown: false };
  
  window.__lastTime = performance.now();
  window.__deltaTime = 0;
  window.__gs_update = function(now) { 
    window.__deltaTime = (now - window.__lastTime) / 1000; 
    window.__lastTime = now; 
  };

  window.__keyState = {};
  window.addEventListener('keydown', (e) => {
    let s = window.__keyState[e.key] || { down: false, pressed: false, released: false };
    if (!s.down) s.pressed = true;
    s.down = true;
    s.released = false;
    window.__keyState[e.key] = s;
  });
  
  window.addEventListener('keyup', (e) => {
    let s = window.__keyState[e.key] || { down: false, pressed: false, released: false };
    s.down = false;
    s.pressed = false;
    s.released = true;
    window.__keyState[e.key] = s;
  });

  window.__mouseState = { 
    x: 0, 
    y: 0, 
    left: { down: false, pressed: false, released: false },
    right: { down: false, pressed: false, released: false }
  };
  
  window.addEventListener('mousemove', (e) => {
    const rect = window.canvas.getBoundingClientRect();
    window.__mouseState.x = e.clientX - rect.left;
    window.__mouseState.y = e.clientY - rect.top;
  });
  
  window.addEventListener('mousedown', (e) => {
    const btn = e.button === 0 ? 'left' : 'right';
    if (!window.__mouseState[btn].down) {
      window.__mouseState[btn].pressed = true;
    }
    window.__mouseState[btn].down = true;
    window.__mouseState[btn].released = false;
  });
  
  window.addEventListener('mouseup', (e) => {
    const btn = e.button === 0 ? 'left' : 'right';
    window.__mouseState[btn].down = false;
    window.__mouseState[btn].pressed = false;
    window.__mouseState[btn].released = true;
  });
  
  window.addEventListener('contextmenu', (e) => e.preventDefault());
}
`;

JSG.forBlock['when_start'] = function(block) {
  const body = getNext(block);
  return `${INIT_PREAMBLE}\n(async () => {\n${body}\n})();\n`;
};

JSG.forBlock['when_closed'] = function(block) {
  const body = getNext(block);
  return `${INIT_PREAMBLE}\nwindow.addEventListener('beforeunload', async (ev) => {\n${body}\n});\n`;
};

JSG.forBlock['when_receive'] = function(block) {
  const msgCode = safeValueCode(block, "MSG", "''");
  const body = getNext(block);
  return `${INIT_PREAMBLE}\ndocument.addEventListener(${msgCode}, async (e) => {\n${body}\n});\n`;
};

JSG.forBlock['broadcast'] = function(block) {
  const msgCode = safeValueCode(block, "MSG", "''");
  return `document.dispatchEvent(new CustomEvent(${msgCode}));\n`;
};

JSG.forBlock['when_key_pressed'] = function(block) {
  const keyCode = safeValueCode(block, "KEY", "''");
  const body = getNext(block);
  return `${INIT_PREAMBLE}\ndocument.addEventListener('keydown', async (e) => { 
    if (e.key === ${keyCode}) { 
      ${body} 
    } 
  });\n`;
};

JSG.forBlock['when_mouse_clicked'] = function(block) {
  const btn = block.getFieldValue("BUTTON") || "any";
  const body = getNext(block);
  
  if (btn === "any") {
    return `${INIT_PREAMBLE}\ndocument.addEventListener('mousedown', async (e) => { ${body} });\n`;
  } else if (btn === "left") {
    return `${INIT_PREAMBLE}\ndocument.addEventListener('mousedown', async (e) => { 
      if (e.button === 0) { ${body} } 
    });\n`;
  } else {
    return `${INIT_PREAMBLE}\ndocument.addEventListener('mousedown', async (e) => { 
      if (e.button === 2) { ${body} } 
    });\n`;
  }
};

JSG.forBlock['forever'] = function(block) {
  const body = JSG.statementToCode(block, "DO") || "";
  return `(function loop(now) {
  window.__gs_update(now || performance.now());
  ${body}
  requestAnimationFrame(loop);
})();\n`;
};

JSG.forBlock['wait_seconds'] = function(block) {
  const secs = safeValueCode(block, "SECS", "0");
  return `await new Promise(r => setTimeout(r, (${secs}) * 1000));\n`;
};

JSG.forBlock['go_to'] = function(block) {
  const x = safeValueCode(block, "X", "0");
  const y = safeValueCode(block, "Y", "0");
  return `
if (window.sprite && window.ctx) {
  const newX = Number(${x});
  const newY = Number(${y});
  if (sprite.penDown) {
    ctx.beginPath();
    ctx.moveTo(sprite.x, sprite.y);
    sprite.x = newX;
    sprite.y = newY;
    ctx.lineTo(sprite.x, sprite.y);
    ctx.stroke();
  } else {
    sprite.x = newX;
    sprite.y = newY;
  }
}
`;
};

JSG.forBlock['turn'] = function(block) {
  const dir = block.getFieldValue("DIR") || "1";
  const angle = safeValueCode(block, "ANGLE", "0");
  return `if (window.sprite) { 
  sprite.rotation = (sprite.rotation || 0) + (${dir}) * Number(${angle}); 
}\n`;
};

JSG.forBlock['move_forward'] = function(block) {
  const steps = safeValueCode(block, "STEPS", "0");
  return `
if (window.sprite && window.ctx) {
  const rad = (sprite.rotation || 0) * Math.PI / 180;
  const dist = Number(${steps});
  
  if (sprite.penDown) {
    ctx.beginPath();
    ctx.moveTo(sprite.x, sprite.y);
  }
  
  sprite.x += Math.cos(rad) * dist;
  sprite.y += Math.sin(rad) * dist;
  
  if (sprite.penDown) {
    ctx.lineTo(sprite.x, sprite.y);
    ctx.stroke();
  }
}
`;
};

JSG.forBlock['change_x_by'] = function(block) {
  const dx = safeValueCode(block, "DX", "0");
  return `if (window.sprite) { sprite.x = (sprite.x || 0) + Number(${dx}); }\n`;
};

JSG.forBlock['change_y_by'] = function(block) {
  const dy = safeValueCode(block, "DY", "0");
  return `if (window.sprite) { sprite.y = (sprite.y || 0) + Number(${dy}); }\n`;
};

JSG.forBlock['point_direction'] = function(block) {
  const dirCode = safeValueCode(block, "DIR", "0");
  return `if (window.sprite) { sprite.rotation = Number(${dirCode}); }\n`;
};

JSG.forBlock['get_x'] = function() { 
  return ["(window.sprite ? sprite.x : 0)", JSG.ORDER_ATOMIC]; 
};

JSG.forBlock['get_y'] = function() { 
  return ["(window.sprite ? sprite.y : 0)", JSG.ORDER_ATOMIC]; 
};

JSG.forBlock['get_direction'] = function() { 
  return ["(window.sprite ? sprite.rotation : 0)", JSG.ORDER_ATOMIC]; 
};

JSG.forBlock['angle_value'] = function(block) { 
  return [String(block.getFieldValue("ANGLE") || "0"), JSG.ORDER_ATOMIC]; 
};

JSG.forBlock['clear_canvas'] = function() { 
  return `if (window.ctx && window.canvas) { 
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
}\n`; 
};

JSG.forBlock['set_pen'] = function(block) { 
  const state = block.getFieldValue("STATE") === "true";
  return `if (window.sprite) { sprite.penDown = ${state}; }\n`; 
};

JSG.forBlock['set_pen_color'] = function(block) {
  const colorCode = safeValueCode(block, "COLOR", "'#000000'");
  return `if (window.ctx) { ctx.strokeStyle = ${colorCode}; }\n`;
};

JSG.forBlock['set_pen_size'] = function(block) { 
  const size = safeValueCode(block, "SIZE", "1");
  return `if (window.ctx) { ctx.lineWidth = Number(${size}); }\n`; 
};

JSG.forBlock['change_pen_size'] = function(block) { 
  const dsize = safeValueCode(block, "DSIZE", "0");
  return `if (window.ctx) { ctx.lineWidth = (ctx.lineWidth || 1) + Number(${dsize}); }\n`; 
};

JSG.forBlock['is_key'] = function(block) {
  const keyCode = safeValueCode(block, "KEY", "''");
  const state = block.getFieldValue("STATE") || "down";
  return [
    `(window.__keyState && window.__keyState[${keyCode}] ? Boolean(window.__keyState[${keyCode}].${state}) : false)`, 
    JSG.ORDER_ATOMIC
  ];
};

JSG.forBlock['mouse_button_state'] = function(block) {
  const btn = block.getFieldValue("BUTTON") || "left";
  const state = block.getFieldValue("STATE") || "down";
  
  if (btn === "any") {
    return [
      `(window.__mouseState ? (window.__mouseState.left.${state} || window.__mouseState.right.${state}) : false)`, 
      JSG.ORDER_ATOMIC
    ];
  } else {
    return [
      `(window.__mouseState ? Boolean(window.__mouseState.${btn}.${state}) : false)`, 
      JSG.ORDER_ATOMIC
    ];
  }
};

JSG.forBlock['mouse_x'] = function() { 
  return ["(window.__mouseState ? window.__mouseState.x : 0)", JSG.ORDER_ATOMIC]; 
};

JSG.forBlock['mouse_y'] = function() { 
  return ["(window.__mouseState ? window.__mouseState.y : 0)", JSG.ORDER_ATOMIC]; 
};

JSG.forBlock['delta_time'] = function() { 
  return ["(window.__deltaTime || 0)", JSG.ORDER_ATOMIC]; 
};

JSG.forBlock['fps'] = function() { 
  return ["(window.__deltaTime && window.__deltaTime > 0 ? Math.round(1 / window.__deltaTime) : 0)", JSG.ORDER_ATOMIC]; 
};

JSG.forBlock['screen_width'] = function() { 
  return ["(window.canvas ? canvas.width : 0)", JSG.ORDER_ATOMIC]; 
};

JSG.forBlock['screen_height'] = function() { 
  return ["(window.canvas ? canvas.height : 0)", JSG.ORDER_ATOMIC]; 
};

JSG.forBlock['colour_value'] = function(block) { 
  return [JSON.stringify(block.getFieldValue("COLOR") || "#ff0000"), JSG.ORDER_ATOMIC]; 
};