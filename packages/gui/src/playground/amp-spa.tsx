import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import render from "./app-target";
import styles from "./amp-spa.css";
import lsNamespace from '../lib/amp-localstorage-namespace';
import Header from "../website/components/header/header";
import Footer from "../website/components/footer/footer";
import "./import-first";
import "../lib/themes/fonts/inter";
import { APP_NAME } from "@ampmod/branding";
import { applyGuiColors } from '../lib/themes/guiHelpers';
import { detectTheme } from '../lib/themes/themePersistance';

const Interface = lazy(() => import(/* webpackChunkName: "interface" */ './render-interface'));
const Embed = lazy(() => import(/* webpackChunkName: "embed" */ './embed'));
const Home = lazy(() => import(/* webpackChunkName: "home" */ '../website/home/home'));
const Examples = lazy(() => import(/* webpackChunkName: "examples-landing" */ '../website/examples/examples'));

applyGuiColors(detectTheme());

const NotFound: React.FC = () => {
  React.useEffect(() => {
    document.title = `Not Found - ${APP_NAME}`;
  }, []);

  return (
    <div className={styles.launching} data-theme={theme} ref={el => el?.style.setProperty('--loader-accent', accent)}>
      <h1>That page doesn't exist. :(</h1>
      <br />
      <div>
        <Link to="/editor">Use {APP_NAME}</Link>,{' '}
        <Link to="/examples">check example projects</Link> or{' '}
        <Link to="/">go to the homepage</Link>.
      </div>
    </div>
  );
};
let accent = process.env.ampmod_mode === 'canary' ? '#FF4C4C' : '#4fa55c';
let theme = '';

const themeSetting = localStorage.getItem(`${lsNamespace}theme`);
try {
  const parsed = JSON.parse(themeSetting);
  theme = parsed.gui;
  if (parsed.accent) {
    const accentMap: Record<string, string> = {
      'purple': '#855cd6',
      'blue': '#4c97ff',
      'green': '#4fa55c',
      'green-old': '#59c059',
      'grey': '#333',
      'red': '#FF4C4C',
      'rainbow': '#4fa55c',
    };
    accent = accentMap[parsed.accent] || accent;
  }
} catch (e) { /* ignore */ }

if (!theme) {
  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const RedirectWithParams: React.FC<{ to: string }> = ({ to }) => {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}${location.hash}`} replace />;
};

render(
  <Router basename={process.env.ROOT} future={{ v7_startTransition: true }}>
    <Suspense fallback={
      <div className={styles.launching} />
    }>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/examples" element={<Examples />} />
        <Route path="/editor" element={<Interface />} />
        <Route path="/player" element={<RedirectWithParams to="/editor" />} />
        <Route path="/fullscreen" element={<Interface isFullScreen />} />
        <Route path="/embed" element={<Embed />} />
        <Route path="/index.html" element={<RedirectWithParams to="/" />} />
        <Route path="/examples.html" element={<RedirectWithParams to="/examples" />} />
        <Route path="/editor.html" element={<RedirectWithParams to="/editor" />} />
        <Route path="/player.html" element={<RedirectWithParams to="/editor" />} />
        <Route path="/fullscreen.html" element={<RedirectWithParams to="/fullscreen" />} />
        <Route path="/embed.html" element={<RedirectWithParams to="/embed" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </Router>
);
