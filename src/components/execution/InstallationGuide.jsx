import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Wrench, AlertCircle, CheckCircle, Clock, Users, Download, PlayCircle, Package, ShieldAlert } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from '@/components/ui/accordion';
const installationInstructions = {
    bed_assembly: {
        title: 'Bed Frame Assembly',
        duration: '45-60 minutes',
        difficulty: 'medium',
        peopleNeeded: 2,
        tools: ['Allen key', 'Screwdriver', 'Hammer', 'Level'],
        materials: ['Bed frame parts', 'Screws and bolts', 'Wood glue (optional)'],
        steps: [
            'Unpack all parts and lay them out. Check against parts list.',
            'Identify headboard, footboard, and side rails.',
            'Attach side rails to headboard using provided bolts.',
            'Attach footboard to side rails.',
            'Install center support beam if included.',
            'Place slats across the frame, ensuring even spacing.',
            'Tighten all bolts firmly but don\'t over-tighten.',
            'Check that frame is level and stable.',
        ],
        tips: [
            'Have someone help hold pieces in place while bolting',
            'Don\'t tighten bolts fully until all pieces are connected',
            'Place cardboard under frame to protect floor',
            'Keep instruction manual for future reference',
        ],
        warnings: [
            'Do not stand on frame during assembly',
            'Keep small parts away from children',
            'Ensure frame is on level surface before use',
        ],
    },
    wardrobe_installation: {
        title: 'Wardrobe Installation',
        duration: '2-3 hours',
        difficulty: 'hard',
        peopleNeeded: 2,
        tools: ['Power drill', 'Level', 'Measuring tape', 'Screwdriver set', 'Stud finder'],
        materials: ['Wardrobe panels', 'Wall anchors', 'Screws', 'Shelves', 'Hanging rod'],
        steps: [
            'Measure and mark wall for placement.',
            'Use stud finder to locate wall studs for secure mounting.',
            'Assemble base/bottom panel first.',
            'Attach side panels to base.',
            'Install back panel if provided.',
            'Add shelves and hanging rod hardware.',
            'Attach top panel.',
            'Secure wardrobe to wall using anchors/studs.',
            'Install doors and adjust hinges for proper alignment.',
            'Add handles and any finishing hardware.',
        ],
        tips: [
            'Wall mounting is essential for safety - never skip this step',
            'Ensure wardrobe is perfectly level before securing to wall',
            'Pre-drill holes in panels to prevent splitting',
            'Adjust door hinges after mounting for perfect alignment',
        ],
        warnings: [
            'MUST be secured to wall to prevent tipping - especially with children',
            'Check wall type and use appropriate anchors',
            'Do not overload shelves beyond weight capacity',
        ],
    },
    lighting_installation: {
        title: 'Ceiling Light Installation',
        duration: '30-45 minutes',
        difficulty: 'medium',
        peopleNeeded: 2,
        tools: ['Screwdriver', 'Wire stripper', 'Voltage tester', 'Ladder'],
        materials: ['Light fixture', 'Wire nuts', 'Mounting bracket'],
        steps: [
            'TURN OFF POWER at circuit breaker. Verify power is off with voltage tester.',
            'Remove old fixture if replacing.',
            'Inspect ceiling box and mounting bracket.',
            'Connect ground wire (green/bare copper) first.',
            'Connect neutral wire (white to white).',
            'Connect hot wire (black/red to black).',
            'Secure all connections with wire nuts.',
            'Tuck wires into ceiling box.',
            'Attach fixture to mounting bracket.',
            'Install bulbs and shade/cover.',
            'Turn power back on and test.',
        ],
        tips: [
            'Take photo of old wiring before disconnecting',
            'Have someone hold fixture while you connect wires',
            'Use voltage tester even if you turned off breaker',
            'Ensure ceiling box can support fixture weight',
        ],
        warnings: [
            'ALWAYS turn off power at breaker - not just the switch',
            'If unsure about wiring, hire a licensed electrician',
            'Check fixture weight limits for ceiling box',
            'Do not touch any wires until verifying power is off',
        ],
    },
    curtain_rod: {
        title: 'Curtain Rod Installation',
        duration: '20-30 minutes',
        difficulty: 'easy',
        peopleNeeded: 2,
        tools: ['Power drill', 'Level', 'Pencil', 'Measuring tape', 'Screwdriver'],
        materials: ['Curtain rod', 'Brackets', 'Screws', 'Wall anchors'],
        steps: [
            'Measure window width and mark bracket positions (4-6 inches from edges).',
            'Mark height 4-6 inches above window frame.',
            'Use level to ensure marks are at same height.',
            'Drill pilot holes at marks.',
            'Insert wall anchors if not drilling into studs.',
            'Attach brackets using provided screws.',
            'Slide curtain onto rod.',
            'Place rod onto brackets.',
            'Tighten set screws on brackets to secure rod.',
        ],
        tips: [
            'Hang rod 4-6 inches above window for illusion of height',
            'Extend rod 4-6 inches beyond window on each side',
            'Use wall anchors for drywall, not just screws',
            'Ensure brackets are level with each other',
        ],
    },
    wall_art: {
        title: 'Wall Art & Mirror Hanging',
        duration: '15-20 minutes per piece',
        difficulty: 'easy',
        peopleNeeded: 1,
        tools: ['Hammer', 'Level', 'Measuring tape', 'Pencil', 'Picture hangers'],
        materials: ['Art/Mirror', 'Picture hooks or anchors', 'Nails or screws'],
        steps: [
            'Decide on placement (eye level is typically 57-60 inches from floor).',
            'Mark desired position lightly with pencil.',
            'Measure distance from hanging hardware to top of frame.',
            'Mark wall where nail/screw should go.',
            'Use level to ensure mark is straight.',
            'Install appropriate hanger (weight-rated for item).',
            'Hang art and check level.',
            'Adjust if needed.',
        ],
        tips: [
            'Gallery wall: lay arrangement on floor first',
            'Use painter\'s tape to visualize placement',
            'For heavy mirrors, use two hooks for stability',
            'Eye level is typically 57-60 inches (center of art)',
        ],
        warnings: [
            'Use appropriate weight-rated hangers',
            'Heavy mirrors (>20 lbs) need wall anchors or studs',
            'Always use safety backing tape on mirrors',
        ],
    },
};
export function InstallationGuide({ category }) {
    const instructions = category
        ? { [category]: installationInstructions[category] }
        : installationInstructions;
    const getDifficultyBadge = (difficulty) => {
        const colors = {
            easy: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            hard: 'bg-red-100 text-red-800',
        };
        return colors[difficulty] || colors.medium;
    };
    return (<div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-start gap-4">
          <Wrench className="h-8 w-8 text-primary"/>
          <div>
            <h2 className="text-2xl font-heading font-bold mb-2">
              Step-by-Step Installation Guide
            </h2>
            <p className="text-muted-foreground">
              Detailed instructions for DIY installation. Hire a professional if you're unsure!
            </p>
          </div>
        </div>
      </Card>

      {/* Safety First */}
      <Card className="p-4 border-yellow-200 bg-yellow-50/50">
        <div className="flex gap-3">
          <ShieldAlert className="h-6 w-6 text-yellow-600 shrink-0"/>
          <div>
            <p className="font-semibold text-yellow-900">Safety First!</p>
            <div className="text-sm text-yellow-800 space-y-1 mt-1">
              <p>• Always turn off power when working with electrical fixtures</p>
              <p>• Use proper safety equipment (gloves, goggles, etc.)</p>
              <p>• Don't work alone for heavy items or height work</p>
              <p>• When in doubt, hire a licensed professional</p>
              <p>• Keep children and pets away from work area</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Installation Instructions */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {Object.entries(instructions).map(([key, instruction]) => (<AccordionItem key={key} value={key} className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-4 text-left">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wrench className="h-5 w-5 text-primary"/>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{instruction.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <Badge className={getDifficultyBadge(instruction.difficulty)}>
                      {instruction.difficulty}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3"/>
                      {instruction.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3"/>
                      {instruction.peopleNeeded} {instruction.peopleNeeded === 1 ? 'person' : 'people'}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="px-6 pb-6 space-y-6">
                {/* Tools & Materials */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="h-4 w-4 text-primary"/>
                      <span className="font-medium">Tools Needed</span>
                    </div>
                    <div className="space-y-1">
                      {instruction.tools.map((tool, i) => (<div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600"/>
                          <span>{tool}</span>
                        </div>))}
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-primary"/>
                      <span className="font-medium">Materials</span>
                    </div>
                    <div className="space-y-1">
                      {instruction.materials.map((material, i) => (<div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600"/>
                          <span>{material}</span>
                        </div>))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Steps */}
                <div>
                  <p className="font-semibold mb-3">Installation Steps</p>
                  <div className="space-y-3">
                    {instruction.steps.map((step, i) => (<div key={i} className="flex gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm pt-0.5">{step}</p>
                      </div>))}
                  </div>
                </div>

                {/* Tips */}
                {instruction.tips.length > 0 && (<>
                    <Separator />
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600"/>
                        <span className="font-medium text-green-900">Pro Tips</span>
                      </div>
                      <div className="space-y-1">
                        {instruction.tips.map((tip, i) => (<div key={i} className="flex items-start gap-2 text-sm text-green-800">
                            <span className="mt-0.5">•</span>
                            <span>{tip}</span>
                          </div>))}
                      </div>
                    </div>
                  </>)}

                {/* Warnings */}
                {instruction.warnings && instruction.warnings.length > 0 && (<>
                    <Separator />
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-red-600"/>
                        <span className="font-medium text-red-900">Important Warnings</span>
                      </div>
                      <div className="space-y-1">
                        {instruction.warnings.map((warning, i) => (<div key={i} className="flex items-start gap-2 text-sm text-red-800">
                            <AlertCircle className="h-3 w-3 mt-0.5 shrink-0"/>
                            <span>{warning}</span>
                          </div>))}
                      </div>
                    </div>
                  </>)}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2"/>
                    Download PDF Guide
                  </Button>
                  <Button variant="outline">
                    <PlayCircle className="h-4 w-4 mr-2"/>
                    Watch Video Tutorial
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>))}
      </Accordion>

      {/* When to Call a Professional */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          When to Call a Professional
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg">
            <p className="font-medium">⚡ Electrical Work</p>
            <p className="text-sm text-muted-foreground mt-1">
              Anything beyond basic fixture replacement should be done by licensed electrician
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">🔧 Plumbing</p>
            <p className="text-sm text-muted-foreground mt-1">
              Gas lines, major pipe work, or anything you're unsure about
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">🏗️ Structural Changes</p>
            <p className="text-sm text-muted-foreground mt-1">
              Wall removal, beam work, or load-bearing modifications
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">📦 Heavy Items</p>
            <p className="text-sm text-muted-foreground mt-1">
              Large wardrobes, heavy mirrors, ceiling fans - need proper mounting
            </p>
          </div>
        </div>
      </Card>
    </div>);
}
