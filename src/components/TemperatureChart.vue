<template>
  <div class="chart">
    <canvas ref="canvas" role="img" :aria-label="title" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  Chart,
  CategoryScale,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

// Only the pieces we need: keeps the bundle small. Plain chart.js, no Vue wrapper.
Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Filler, Tooltip);

const props = defineProps<{
  labels: string[];
  values: number[];
  title: string;
  night?: boolean;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart<'line'> | null = null;

const palette = () =>
  props.night
    ? { line: '#8ab4ff', fill: 'rgb(138 180 255 / 18%)', text: '#c3cde0', grid: 'rgb(255 255 255 / 10%)' }
    : { line: '#2563eb', fill: 'rgb(37 99 235 / 12%)', text: '#667085', grid: 'rgb(16 24 40 / 8%)' };

const applyData = () => {
  if (!chart) return;
  const colors = palette();
  const dataset = chart.data.datasets[0];
  chart.data.labels = [...props.labels];
  if (dataset) {
    dataset.data = [...props.values];
    dataset.label = props.title;
    dataset.borderColor = colors.line;
    dataset.backgroundColor = colors.fill;
    dataset.pointBackgroundColor = colors.line;
  }
  const scales = chart.options.scales;
  if (scales?.x?.ticks) scales.x.ticks.color = colors.text;
  if (scales?.y?.ticks) scales.y.ticks.color = colors.text;
  if (scales?.y?.grid) scales.y.grid.color = colors.grid;
  chart.update();
};

onMounted(() => {
  if (!canvas.value) return;
  const colors = palette();

  chart = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels: [...props.labels],
      datasets: [
        {
          label: props.title,
          data: [...props.values],
          borderColor: colors.line,
          backgroundColor: colors.fill,
          pointBackgroundColor: colors.line,
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { tooltip: { callbacks: { label: ctx => `${ctx.parsed.y}°C` } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: colors.text } },
        y: {
          grace: '10%',
          ticks: { color: colors.text, callback: value => `${value}°` },
          grid: { color: colors.grid },
        },
      },
    },
  });
});

watch(() => [props.labels, props.values, props.title, props.night], applyData, { deep: true });

onBeforeUnmount(() => {
  chart?.destroy();
  chart = null;
});
</script>

<style scoped>
.chart {
  position: relative;
  height: 220px;
}
</style>
