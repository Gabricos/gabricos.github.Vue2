<template>
  <div 
    class="metric-card" 
    :class="{ active: isActive }"
    @click="$emit('click')"
  >
    <h3 class="metric-title">{{ title }}</h3>
    <div class="metric-value">{{ formattedValue }}</div>
  </div>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedValue() {
      if (this.title === 'Avg Time') {
        // Converti secondi in minuti:secondi per il tempo medio
        const minutes = Math.floor(this.value / 60)
        const seconds = this.value % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
      }
      
      // Formato numero con separatori per migliaia
      return this.value.toLocaleString()
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.metric-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.metric-card.active {
  border-color: #4f46e5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.metric-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-value {
  font-size: 2.25rem;
  font-weight: bold;
  color: #111827;
  margin: 0;
  line-height: 1;
}

.metric-card.active .metric-value {
  color: #4f46e5;
}

@media (max-width: 768px) {
  .metric-card {
    padding: 1rem;
  }
  
  .metric-value {
    font-size: 1.875rem;
  }
}
</style>