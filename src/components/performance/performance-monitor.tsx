"use client"

import { useEffect, useState, useRef } from 'react'

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  renderTime: number
  interactionLatency: number
  polygonCount: number
  markerCount: number
}

interface PerformanceMonitorProps {
  isVisible?: boolean
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
  polygonCount?: number
  markerCount?: number
}

export function PerformanceMonitor({
  isVisible = false,
  onMetricsUpdate,
  polygonCount = 0,
  markerCount = 0
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    interactionLatency: 0,
    polygonCount: 0,
    markerCount: 0
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const renderStartRef = useRef(0)
  const interactionStartRef = useRef(0)

  useEffect(() => {
    let animationFrame: number

    // FPS monitoring
    const updateFPS = () => {
      frameCountRef.current++
      const now = performance.now()
      const delta = now - lastTimeRef.current

      if (delta >= 1000) { // Update every second
        const fps = Math.round((frameCountRef.current * 1000) / delta)
        frameCountRef.current = 0
        lastTimeRef.current = now

        setMetrics(prev => ({ ...prev, fps }))
      }

      animationFrame = requestAnimationFrame(updateFPS)
    }

    updateFPS()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  // Memory usage monitoring
  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const usedJSHeapSize = memory.usedJSHeapSize / (1024 * 1024) // Convert to MB
        setMetrics(prev => ({ ...prev, memoryUsage: Math.round(usedJSHeapSize) }))
      }
    }

    updateMemoryUsage()
    const interval = setInterval(updateMemoryUsage, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [])

  // Update polygon and marker counts
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      polygonCount,
      markerCount
    }))
  }, [polygonCount, markerCount])

  // Measure render performance
  useEffect(() => {
    const measureRenderTime = () => {
      renderStartRef.current = performance.now()
    }

    const finishRenderTime = () => {
      if (renderStartRef.current > 0) {
        const renderTime = performance.now() - renderStartRef.current
        setMetrics(prev => ({ ...prev, renderTime: Math.round(renderTime) }))
        renderStartRef.current = 0
      }
    }

    // Listen for DOM updates (approximate render time)
    const observer = new MutationObserver(() => {
      measureRenderTime()
      setTimeout(finishRenderTime, 0)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    })

    return () => observer.disconnect()
  }, [])

  // Measure interaction latency
  useEffect(() => {
    const handleInteractionStart = () => {
      interactionStartRef.current = performance.now()
    }

    const handleInteractionEnd = () => {
      if (interactionStartRef.current > 0) {
        const latency = performance.now() - interactionStartRef.current
        setMetrics(prev => ({ ...prev, interactionLatency: Math.round(latency) }))
        interactionStartRef.current = 0
      }
    }

    document.addEventListener('mousedown', handleInteractionStart)
    document.addEventListener('mouseup', handleInteractionEnd)
    document.addEventListener('touchstart', handleInteractionStart)
    document.addEventListener('touchend', handleInteractionEnd)

    return () => {
      document.removeEventListener('mousedown', handleInteractionStart)
      document.removeEventListener('mouseup', handleInteractionEnd)
      document.removeEventListener('touchstart', handleInteractionStart)
      document.removeEventListener('touchend', handleInteractionEnd)
    }
  }, [])

  // Notify parent component of metrics updates
  useEffect(() => {
    onMetricsUpdate?.(metrics)
  }, [metrics, onMetricsUpdate])

  if (!isVisible) return null

  const getPerformanceStatus = () => {
    if (metrics.fps >= 55) return { color: 'text-green-600', status: 'Excellent' }
    if (metrics.fps >= 45) return { color: 'text-yellow-600', status: 'Good' }
    if (metrics.fps >= 25) return { color: 'text-orange-600', status: 'Fair' }
    return { color: 'text-red-600', status: 'Poor' }
  }

  const performanceStatus = getPerformanceStatus()

  return (
    <div className="fixed bottom-4 left-4 z-[2000] bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg font-mono text-xs max-w-xs">
      <div className="mb-2 font-semibold">Performance Monitor</div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span>FPS:</span>
          <span className={performanceStatus.color}>{metrics.fps} ({performanceStatus.status})</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Memory:</span>
          <span className={metrics.memoryUsage > 100 ? 'text-yellow-400' : 'text-green-400'}>
            {metrics.memoryUsage}MB
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Render:</span>
          <span className={metrics.renderTime > 16 ? 'text-yellow-400' : 'text-green-400'}>
            {metrics.renderTime}ms
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Latency:</span>
          <span className={metrics.interactionLatency > 100 ? 'text-yellow-400' : 'text-green-400'}>
            {metrics.interactionLatency}ms
          </span>
        </div>

        <div className="border-t border-gray-600 pt-1 mt-1">
          <div className="flex justify-between items-center">
            <span>Polygons:</span>
            <span className={metrics.polygonCount > 1000 ? 'text-yellow-400' : 'text-green-400'}>
              {metrics.polygonCount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Markers:</span>
            <span className={metrics.markerCount > 500 ? 'text-yellow-400' : 'text-green-400'}>
              {metrics.markerCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Target: 60 FPS, &lt;100MB, &lt;16ms render
      </div>
    </div>
  )
}

// Hook for using performance monitoring in components
export function usePerformanceMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  const startMonitoring = () => setIsMonitoring(true)
  const stopMonitoring = () => setIsMonitoring(false)
  const toggleMonitoring = () => setIsMonitoring(prev => !prev)

  return {
    isMonitoring,
    metrics,
    startMonitoring,
    stopMonitoring,
    toggleMonitoring,
    setMetrics
  }
}