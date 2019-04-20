# Airy Canvas

Powerful front-end interactive drawing board.

## Features
- infinite canvas
- toolbox plugins
- integration with Vuex

## Basic Usage
```html
<!-- Vue Component -->
<template>
  <airy-canvas
    :data="airyCanvasData"
    :options="airyCanvasOptions"
  />
</template>

<script>
import Vue from 'Vue'
import AiryCanvas from 'airy-canvas'

export default {
  ...,
  components: {
    AiryCanvas
  },
  data() {
    return {
      airyCanvasData: [],
      airyCanvasOptions: {
        fluid: true
      }
    }
  },
  ...
}
</script>
```

## Plugins (Not finished)
Want more tools in Airy Canvas? Airy Canvas accept plugins.

### init with Airy Canvas

```html
<!-- Vue Component -->
<template>
  <airy-canvas
    :data="airyCanvasData"
    :options="airyCanvasOptions"
  />
</template>

<script>
import Vue from 'Vue'
import AiryCanvas from 'airy-canvas'
import AiryCanvasPolygon from 'airy-canvas-polygon'

export default {
  ...,
  components: {
    AiryCanvas
  },
  data() {
    return {
      airyCanvasData: [],
      airyCanvasOptions: {
        fluid: true,
        plugins: [AiryCanvasPolygon]
      }
    }
  },
  ...
}
</script>
```

### plugin hot loading

```html
<template>
  <airy-canvas
    :data="airyCanvasData"
    :options="airyCanvasOptions"
    ref="airy-canvas"
  />
</template>

<script>
import Vue from 'Vue'
import AiryCanvas from 'airy-canvas'
import AiryCanvasPolygon from 'airy-canvas-polygon'

export default {
  ...,
  components: {
    AiryCanvas
  },
  data() {
    return {
      airyCanvasData: [],
      airyCanvasOptions: {
        fluid: true
      }
    }
  },
  methods: {
    ...
    addPolygonPlugin() {
      this.$refs['airy-canvas'].addPlugin(AiryCanvasPolygon)
    },
    ...
  },
  ...
}
```

## Options

| Attribute  | Description | Type | Accepted Values | Default |
| - | - | - | - | - |
| width  | canvas width | number | - | 800 |
| height  | canvas height | number | - | 600 |
| fluid  | resize by container size | boolean | - | false |
| plugins  | plugins array | array | - | [] |
| store  | vuex integration options | object | - | undefined |
