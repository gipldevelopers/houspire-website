import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { HardHat, CheckCircle, AlertTriangle, Download, Send } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
export function ContractorGuide({ projectId }) {
    const [checkedItems, setCheckedItems] = useState({});
    const contractorTypes = [
        {
            id: 'carpenter',
            name: 'Carpenter',
            description: 'For furniture assembly, custom woodwork',
            tasks: ['Bed assembly', 'Wardrobe installation', 'Shelving'],
            estimatedCost: '₹2,000 - ₹5,000',
            timeline: '2-3 days',
        },
        {
            id: 'painter',
            name: 'Painter',
            description: 'For wall painting, finishing',
            tasks: ['Wall preparation', 'Primer application', '2 coats paint'],
            estimatedCost: '₹15 - ₹25 per sq ft',
            timeline: '3-4 days',
        },
        {
            id: 'electrician',
            name: 'Electrician',
            description: 'For lighting, switches, electrical work',
            tasks: ['Light fixtures', 'Fan installation', 'Switch points'],
            estimatedCost: '₹500 - ₹1,500 per point',
            timeline: '1-2 days',
        },
        {
            id: 'plumber',
            name: 'Plumber',
            description: 'For bathroom/kitchen fixtures',
            tasks: ['Sink installation', 'Tap fitting', 'Drainage'],
            estimatedCost: '₹800 - ₹2,000',
            timeline: '1 day',
        },
        {
            id: 'general',
            name: 'General Contractor',
            description: 'Full-service contractor for complete project',
            tasks: ['Project management', 'All trades coordination', 'Timeline management'],
            estimatedCost: '10-15% of total budget',
            timeline: 'Full project duration',
        },
    ];
    const hiringChecklist = [
        'Get at least 3 quotes for comparison',
        'Check references and past work photos',
        'Verify licenses and insurance',
        'Get written contract with scope, timeline, and payment terms',
        'Agree on payment schedule (typically 30% advance, 40% mid-way, 30% completion)',
        'Clarify who provides materials',
        'Discuss warranty/guarantee on work',
        'Set clear communication channels',
        'Agree on cleanup and waste disposal',
        'Document everything with photos/videos',
    ];
    const redFlags = [
        'Asking for 100% payment upfront',
        'No written contract or estimates',
        'Unable to provide references',
        'Extremely low quotes (too good to be true)',
        'Reluctant to answer questions',
        'No insurance or licenses',
        'Pressure tactics to sign immediately',
        'Vague timeline or scope of work',
    ];
    const questionsToAsk = [
        {
            category: 'Experience & Credentials',
            questions: [
                'How many years of experience do you have?',
                'Do you have relevant licenses and certifications?',
                'Can you show examples of similar projects?',
                'Do you have insurance (liability and workers comp)?',
                'Can you provide 3-5 recent client references?',
            ],
        },
        {
            category: 'Project Details',
            questions: [
                'What is your availability to start?',
                'How long will this project take?',
                'Will you work on multiple projects simultaneously?',
                'Who will be the point of contact?',
                'How many workers will be on-site?',
            ],
        },
        {
            category: 'Costs & Payment',
            questions: [
                'What is included in your quote?',
                'Are there any potential additional costs?',
                'What is your payment schedule?',
                'What happens if timeline extends?',
                'Do you offer any warranties?',
            ],
        },
        {
            category: 'Work Process',
            questions: [
                'What are your working hours?',
                'How do you handle changes to scope?',
                'What is your cleanup process?',
                'How do you handle material procurement?',
                'What happens if there are issues with work?',
            ],
        },
    ];
    const sampleContract = `
INTERIOR WORK CONTRACT

This agreement made on [DATE] between:

CLIENT: [Your Name]
Address: [Your Address]
Contact: [Your Phone/Email]

CONTRACTOR: [Contractor Name]
Address: [Contractor Address]
Contact: [Contractor Phone/Email]

SCOPE OF WORK:
- Detailed list of all work to be performed
- Specifications and materials to be used
- Room dimensions and project location

TIMELINE:
Start Date: [DATE]
Completion Date: [DATE]
Penalty for delay: [AMOUNT/day after agreed date]

PAYMENT TERMS:
Total Contract Value: ₹[AMOUNT]
Advance Payment (30%): ₹[AMOUNT] - Payable on [DATE]
Mid-Project (40%): ₹[AMOUNT] - Payable on [DATE]
Final Payment (30%): ₹[AMOUNT] - Payable on completion

TERMS & CONDITIONS:
1. Materials to be provided by: [CLIENT/CONTRACTOR]
2. Working hours: [TIME] to [TIME]
3. Cleanup responsibility: [CONTRACTOR]
4. Warranty period: [DURATION]
5. Change order process: Written approval required
6. Dispute resolution: [METHOD]

CLIENT SIGNATURE: _______________ DATE: _______
CONTRACTOR SIGNATURE: ___________ DATE: _______
  `.trim();
    return (<div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-start gap-4">
          <HardHat className="h-8 w-8 text-primary"/>
          <div>
            <h2 className="text-2xl font-heading font-bold mb-2">
              Contractor Hiring Guide
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know to hire reliable contractors and get quality work done
            </p>
          </div>
        </div>
      </Card>

      {/* Contractor Types Needed */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Contractors You May Need
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contractorTypes.map((contractor) => (<Card key={contractor.id} className="p-4 border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{contractor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {contractor.description}
                  </p>
                </div>
                <Badge variant="outline">{contractor.timeline}</Badge>
              </div>

              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Typical tasks:</p>
                <div className="flex flex-wrap gap-1">
                  {contractor.tasks.map((task, i) => (<p key={i} className="text-xs bg-muted px-2 py-0.5 rounded">{task}</p>))}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Cost: <span className="text-foreground font-medium">{contractor.estimatedCost}</span>
                </span>
              </div>
            </Card>))}
        </div>
      </Card>

      {/* Hiring Checklist */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-600"/>
          <h3 className="text-lg font-semibold">Pre-Hiring Checklist</h3>
        </div>
        <div className="space-y-3">
          {hiringChecklist.map((item, index) => (<div key={index} className="flex items-center gap-3">
              <Checkbox checked={checkedItems[`hiring-${index}`] || false} onCheckedChange={(checked) => setCheckedItems({ ...checkedItems, [`hiring-${index}`]: !!checked })}/>
              <span className={checkedItems[`hiring-${index}`] ? 'line-through text-muted-foreground' : ''}>
                {item}
              </span>
            </div>))}
        </div>
      </Card>

      {/* Red Flags */}
      <Card className="p-6 border-red-200 bg-red-50/50">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600"/>
          <h3 className="text-lg font-semibold text-red-900">Red Flags to Watch Out For</h3>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {redFlags.map((flag, index) => (<div key={index} className="flex items-center gap-2 text-red-800">
              <span className="text-red-500">✗</span>
              <span>{flag}</span>
            </div>))}
        </div>
      </Card>

      {/* Questions to Ask */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Questions to Ask Contractors
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {questionsToAsk.map((section, index) => (<AccordionItem key={index} value={`section-${index}`}>
              <AccordionTrigger>
                {section.category}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-4">
                  {section.questions.map((question, qIndex) => (<div key={qIndex} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{question}</span>
                    </div>))}
                </div>
              </AccordionContent>
            </AccordionItem>))}
        </Accordion>
      </Card>

      {/* Sample Contract */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Sample Contract Template
        </h3>
        <div className="bg-muted rounded-lg p-4 max-h-[300px] overflow-y-auto">
          <pre className="text-sm whitespace-pre-wrap font-mono">
            {sampleContract}
          </pre>
        </div>
        <Button variant="outline" className="mt-4">
          <Download className="h-4 w-4 mr-2"/>
          Download Contract Template
        </Button>
      </Card>

      {/* Local Contractor Recommendations */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h3 className="text-lg font-semibold mb-2">
          Find Vetted Contractors
        </h3>
        <p className="text-muted-foreground mb-4">
          We've partnered with verified contractors in your area. Get 3 quotes instantly!
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium">Service Needed</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select service"/>
              </SelectTrigger>
              <SelectContent>
                {contractorTypes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Your City</label>
            <Input placeholder="e.g., Mumbai"/>
          </div>
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <Input placeholder="+91 98xxx xxxxx"/>
          </div>
        </div>
        <Button className="mt-4">
          <Send className="h-4 w-4 mr-2"/>
          Get Free Quotes from 3 Contractors
        </Button>
      </Card>

      {/* Payment Protection Tips */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Payment Protection Tips
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5"/>
            <div>
              <p className="font-medium">Standard Payment Schedule</p>
              <p className="text-sm text-muted-foreground">
                30% advance, 40% at 50% completion, 30% on final approval. 
                Never pay 100% upfront.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5"/>
            <div>
              <p className="font-medium">Get Everything in Writing</p>
              <p className="text-sm text-muted-foreground">
                Scope, timeline, costs, materials, warranties - all should be documented.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5"/>
            <div>
              <p className="font-medium">Inspect Before Final Payment</p>
              <p className="text-sm text-muted-foreground">
                Do a thorough walk-through and create a punch list before releasing final payment.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5"/>
            <div>
              <p className="font-medium">Retain 10% for 30 Days</p>
              <p className="text-sm text-muted-foreground">
                Hold back 10% for 30 days post-completion to ensure no defects appear.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>);
}
