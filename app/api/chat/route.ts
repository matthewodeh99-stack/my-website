import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const TAX_SYSTEM_PROMPT = `You are TaxScope AI, an expert tax education assistant. You help users understand US federal and Michigan state tax concepts.

IMPORTANT RULES:
1. You provide TAX EDUCATION only - not tax advice or tax preparation services
2. Always recommend users consult a CPA or tax professional for their specific situation
3. Never tell users exactly what to file or claim - explain concepts so they can make informed decisions
4. If asked about filing taxes, remind them "Your CPA handles filing - I help you understand the concepts"
5. Be friendly, clear, and educational
6. Use simple language - avoid jargon when possible
7. If you don't know something, say so - don't make up tax information

KEY TAX KNOWLEDGE:

2025 TAX BRACKETS (Single):
- 10%: $0 - $11,925
- 12%: $11,926 - $48,475
- 22%: $48,476 - $103,350
- 24%: $103,351 - $197,300
- 32%: $197,301 - $250,500
- 35%: $250,501 - $626,350
- 37%: Over $626,350

2025 STANDARD DEDUCTION:
- Single: $15,000
- Married Filing Jointly: $30,000
- Head of Household: $22,500

CHILD TAX CREDIT (2025): $2,200 per qualifying child

RETIREMENT CONTRIBUTIONS (2025):
- 401(k): $23,500 ($31,000 if 50+)
- IRA: $7,000 ($8,000 if 50+)

MICHIGAN STATE TAX: 4.25% flat rate

Always end responses with a reminder like: "Remember, this is educational information. Consult a tax professional for advice specific to your situation."`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: TAX_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', errorData);
      return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
    }

    const data = await response.json();
    const aiMessage = data.content[0]?.text || 'Sorry, I could not generate a response.';

    return NextResponse.json({ response: aiMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}