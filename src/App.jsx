import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import PublicLayout from './components/PublicLayout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Schedule from './pages/Schedule.jsx'
import Events from './pages/Events.jsx'
import EventDetail from './pages/EventDetail.jsx'
import Give from './pages/Give.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

import ProtectedRoute from './components/admin/ProtectedRoute.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import Login from './pages/admin/Login.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import SiteConfigAdmin from './pages/admin/SiteConfigAdmin.jsx'
import EventsAdmin from './pages/admin/EventsAdmin.jsx'
import SchedulesAdmin from './pages/admin/SchedulesAdmin.jsx'
import PartnersAdmin from './pages/admin/PartnersAdmin.jsx'
import SubscriptionsAdmin from './pages/admin/SubscriptionsAdmin.jsx'
import UsersAdmin from './pages/admin/UsersAdmin.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Site público */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/agenda" element={<Schedule />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/eventos/:id" element={<EventDetail />} />
          <Route path="/contribua" element={<Give />} />
          <Route path="/contato" element={<Contact />} />
        </Route>

        {/* Login admin */}
        <Route path="/admin/login" element={<Login />} />

        {/* Painel administrativo (protegido) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="configuracao" element={<SiteConfigAdmin />} />
          <Route path="eventos" element={<EventsAdmin />} />
          <Route path="agenda" element={<SchedulesAdmin />} />
          <Route path="parceiros" element={<PartnersAdmin />} />
          <Route path="inscricoes" element={<SubscriptionsAdmin />} />
          <Route path="usuarios" element={<UsersAdmin />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  )
}
