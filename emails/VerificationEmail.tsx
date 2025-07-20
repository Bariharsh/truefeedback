import {Html,Head,Font,Preview,Heading,Section,Text,Row} from '@react-email/components';

interface VerficationEmailProps {
    otp: string;
    username: string;
}

export default function VerficationEmail({username, otp}: VerficationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kvnz.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello, {username}</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Please use the following code to verify your account:
          </Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email
          </Text>
        </Row>
      </Section>
    </Html>
  )
}