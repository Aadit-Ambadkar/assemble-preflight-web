import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import getCookie from '../lib/cookie.js'
import { useState, useEffect } from 'react'
import qr from 'jsqr'
import { Box, Container, Heading, Grid, Input, Button } from 'theme-ui'

let statusTranslator = {
  'verified': 'Vaccination verified!',
  'verifiedWithDiscrepancy': `We're reviewing your vaccine proof.`,
  'humanReviewRequired': `We're reviewing your vaccine proof.`,
  'denied': <>Your vaccination proof was denied, please upload new proof &rarr;</>,
  'noData': <>Upload Proof of Vaccination &rarr;</>
}

export default function Home() {
  const [status, setStatus] = useState('loading');
  const [accessToken, setAccessToken] = useState('');
  const [userData, setUserData] = useState({});
  const [greeting, setGreeting] = useState('Hello');
  const [cardType, setCardType] = useState('');
  const [file, setFile] = useState(null);
  useEffect(() => {
    (async () => {
      let cookie = await fetch('/api/token').then(res => res.text());
      if (cookie) {
        setAccessToken(cookie);
        setStatus('authed');
        setUserData(await fetch('/api/records').then(res => res.json()));
      } else {
        setStatus('unauthed');
      }
      console.log(qr);
    })();

    let myDate = new Date();
    let hrs = myDate.getHours();
    let greet;

    if (hrs < 12)
      greet = 'Good morning';
    else if (hrs >= 12 && hrs <= 17)
      greet = 'Good afternoon';
    else if (hrs >= 17 && hrs <= 24)
      greet = 'Good evening';
    setGreeting(greet);
  }, []);
  return (
    <div>
      <Head>
        <title>Assemble Preflight</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="https://assemble.hackclub.com/invert.png" />
        <link rel="favicon" href="https://assemble.hackclub.com/invert.png" />
        <link rel="shortcut icon" href="https://assemble.hackclub.com/invert.png" />
      </Head>
      <canvas id="canvas" width="0" height="0" style={{ display: 'none' }}></canvas>
      {status == 'authed' && <Box py={3} sx={{ minHeight: '100vh', backgroundImage: 'linear-gradient(90deg, rgba(2,0,36,0.37718837535014005) 0%, rgba(2,0,36,0.36318277310924374) 35%, rgba(2,0,36,0.36878501400560226) 100%), url(https://cloud-2ppyw38ar-hack-club-bot.vercel.app/0golden-bay.png)', backgroundSize: 'cover' }}>
        <Container py={3} variant="copy" bg="white" sx={{ borderRadius: 4 }}>
        <Heading as="h1" mb={3}>
          Assemble Preflight & Ticketing
        </Heading>
        <Box bg="red" p={3} mb={3} sx={{ borderRadius: 3, color: 'white' }}>
          👋 {userData?.name?.split(' ')?.[0] ? `${greeting}, ${userData?.name?.split(' ')?.[0]}` : greeting}! Please use this portal to upload
          your proof of vaccination and your negative COVID-19 test (option will become available nearer
          to the event). After both have been verified, you will be provided a ticket
          with a barcode. Please screenshot this barcode or add it to Apple/Google Wallet
          and then present it at the front door during checkin. {JSON.stringify(userData)}
        </Box>
        <Box bg="green" px={3} py={2} mb={3} sx={{ display: 'block', borderRadius: 3, width: 'fit-content', color: 'white', fontWeight: 800 }}>Required: Full Vaccination Against COVID-19</Box>
        <Box bg="sunken" className="card" p={3} mb={3} as="a" style={{ display: 'block', borderRadius: 3, fontWeight: 400 }} href="javascript:void 0;" onClick={() => {
          document.getElementById("fileinput").click()
        }}>
          <Heading>{statusTranslator[userData.vaccinationData?.status] || <>Upload Proof of Vaccination &rarr;</>}</Heading>
        </Box>
        <Box bg="orange" px={3} py={2} mb={3} sx={{ display: 'block', borderRadius: 3, width: 'fit-content', color: 'white', fontWeight: 800, opacity: 0.5 }}>Required: Negative ART Test</Box>
        <Box bg="sunken" p={3} mb={3} as="a" style={{ display: 'block', borderRadius: 3, fontWeight: 400, opacity: 0.5 }}>
          <Heading>Upload Coming Soon...</Heading>
        </Box>
        <input type="file" accept="image/*" id="fileinput" style={{display: 'none'}} onChange={async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('data', file, 'assemble_web_' + file.name);
        formData.append('token', accessToken);
        const options = {
          method: 'POST',
          body: formData,
        };
        await fetch(`https://${process.env.NEXT_PUBLIC_TICKETING_DOMAIN}/users`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        })
        fetch('https://api.yodacode.xyz/assemble/vaccines', options).then(res => res.text()).then(text => {
          if (text == 'OK') {
            setStatus('uploaded');
          } else {
            setStatus('error');
          }
        }).catch(() => {
          setStatus('error');
        });
        }} />
        </Container>
      </Box>}

      {status == 'error' && <main>
        <Heading as="h1" mb={3}>
          Assemble Preflight & Ticketing
        </Heading>

        <p>
          🛑 Unexpected Error Occurred
        </p>

        <div>
          <a href="javascript:void 0;" onClick={() => {
            window.location.reload(true);
          }}>
            <h2>Restart &rarr;</h2>
            <p>Restart the vaccine verification process.</p>
          </a>
        </div>

        <p>Please report this error if it does not automatically resolve.</p>
      </main>}

      {status == 'uploaded' && <main>
        <Heading as="h1" mb={3}>
          Assemble Preflight & Ticketing
        </Heading>

        <p>
          Uploaded, page not complete
        </p>
      </main>}
      {status == 'unauthed' && <Box py={3} sx={{ minHeight: '100vh', backgroundImage: 'linear-gradient(90deg, rgba(2,0,36,0.37718837535014005) 0%, rgba(2,0,36,0.36318277310924374) 35%, rgba(2,0,36,0.36878501400560226) 100%), url(https://cloud-2ppyw38ar-hack-club-bot.vercel.app/0golden-bay.png)', backgroundSize: 'cover' }}><Container py={3} variant="copy" bg="white" sx={{ borderRadius: 4 }}>
        <Heading as="h1" mb={3}>
          Assemble Preflight & Ticketing
        </Heading>
        <Box bg="red" p={3} mb={3} sx={{ borderRadius: 3, color: 'white' }}>
          👋 Hey there! We're super excited to be hosting you in San Francisco for
          Assemble 2022. Use this portal, or it's associated iOS app, to upload
          your proof of vaccination and your negative COVID-19 test (opens nearer
          to the event). After both have been verified, you will be provided a ticket
          with a barcode. Please screenshot this barcode or add it to Apple/Google Wallet
          and then present it at the front door during checkin.
        </Box>
        <div>
          <Box bg="sunken" className="card" p={3} mb={3} as="a" href="/login" style={{ display: 'block', borderRadius: 3 }}>
            <Heading mb={2}>Web &rarr;</Heading>
            <Box>Sign in to start the preflight & vaccine verification process in your browser.</Box>
          </Box>
          <Box bg="sunken" className="card" p={3} mb={3} as="a" href={process.env.NEXT_PUBLIC_APPSTORE_URL} style={{ display: 'block', bg: 'sunken', borderRadius: 3 }}>
            <Heading mb={2}>iOS App &rarr;</Heading>
            <Box>Download the iOS app for preflight, vaccine verification, and real-time event integration.</Box>
          </Box>
        </div>
      </Container></Box>}

      {(status == 'loading' || (
        status == 'authed' && Object.keys(userData).length == 0
      )) && <Box py={3} sx={{ minHeight: '100vh', backgroundImage: 'linear-gradient(90deg, rgba(2,0,36,0.37718837535014005) 0%, rgba(2,0,36,0.36318277310924374) 35%, rgba(2,0,36,0.36878501400560226) 100%), url(https://cloud-2ppyw38ar-hack-club-bot.vercel.app/0golden-bay.png)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundSize: 'cover' }}>
          <Heading sx={{color: 'white'}}>
            Loading, please wait...
          </Heading>
        </Box>}
    </div>
  )
}
