
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormValues, offenceSchema } from './index';
import { z } from 'zod';
import { Plus, X, Check, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface OffencesProps {
  form: UseFormReturn<FormValues>;
  offences: z.infer<typeof offenceSchema>[];
  addOffence: (offence: z.infer<typeof offenceSchema>) => void;
  removeOffence: (index: number) => void;
  calculateRemission: (sentence: string) => string;
}

const Offences: React.FC<OffencesProps> = ({ 
  form, 
  offences, 
  addOffence, 
  removeOffence,
  calculateRemission 
}) => {
  const [currentOffence, setCurrentOffence] = useState<z.infer<typeof offenceSchema>>({
    offence: '',
    convictionStatus: 'unconvicted',
    furtherCharge: '',
    court: '',
    sentence: '',
    sentenceDate: '',
    remission: '',
    nextCourtDate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentOffence(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setCurrentOffence(prev => ({ ...prev, [field]: value }));
    
    // Reset conditional fields when conviction status changes
    if (field === 'convictionStatus') {
      if (value === 'convicted') {
        setCurrentOffence(prev => ({ 
          ...prev, 
          nextCourtDate: '',
          convictionStatus: 'convicted'
        }));
      } else {
        setCurrentOffence(prev => ({ 
          ...prev, 
          sentence: '',
          sentenceDate: '',
          remission: '',
          convictionStatus: 'unconvicted'
        }));
      }
    }
    
    // Calculate remission when sentence changes
    if (field === 'sentence' && value) {
      const remission = calculateRemission(value);
      setCurrentOffence(prev => ({ ...prev, remission }));
    }
  };

  const handleAddOffence = () => {
    // Basic validation
    if (!currentOffence.offence || !currentOffence.court) {
      return;
    }

    if (currentOffence.convictionStatus === 'convicted' && !currentOffence.sentence) {
      return;
    }

    if (currentOffence.convictionStatus === 'unconvicted' && !currentOffence.nextCourtDate) {
      return;
    }

    // Add the offence
    addOffence(currentOffence);
    
    // Reset the form
    setCurrentOffence({
      offence: '',
      convictionStatus: 'unconvicted',
      furtherCharge: '',
      court: '',
      sentence: '',
      sentenceDate: '',
      remission: '',
      nextCourtDate: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          <CardTitle>Offences</CardTitle>
        </div>
        <CardDescription>
          Record the inmate's offences and conviction status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* List of already added offences */}
        {offences.length > 0 && (
          <div className="mb-6 border rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="p-2 text-sm font-medium">Offence</th>
                  <th className="p-2 text-sm font-medium">Court</th>
                  <th className="p-2 text-sm font-medium">Status</th>
                  <th className="p-2 text-sm font-medium">
                    {offences[0].convictionStatus === 'convicted' ? 'Sentence' : 'Next Court Date'}
                  </th>
                  <th className="p-2 text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {offences.map((offence, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2 text-sm">{offence.offence}</td>
                    <td className="p-2 text-sm">{offence.court}</td>
                    <td className="p-2 text-sm capitalize">{offence.convictionStatus}</td>
                    <td className="p-2 text-sm">
                      {offence.convictionStatus === 'convicted' 
                        ? offence.sentence 
                        : offence.nextCourtDate}
                    </td>
                    <td className="p-2 text-sm">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeOffence(index)}
                      >
                        <X className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Add new offence form */}
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-4 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add New Offence
          </h4>
          
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
            <div className="space-y-2">
              <FormLabel htmlFor="offence">Offence Description</FormLabel>
              <Textarea
                id="offence"
                name="offence"
                placeholder="Describe the offence"
                value={currentOffence.offence}
                onChange={handleInputChange}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <FormLabel htmlFor="court">Court</FormLabel>
              <Input
                id="court"
                name="court"
                placeholder="Name of court"
                value={currentOffence.court}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <FormLabel htmlFor="convictionStatus">Conviction Status</FormLabel>
            <Select 
              value={currentOffence.convictionStatus}
              onValueChange={(value) => handleSelectChange('convictionStatus', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="convicted">Convicted</SelectItem>
                <SelectItem value="unconvicted">Unconvicted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 mb-4">
            <FormLabel htmlFor="furtherCharge">Further Charge (Optional)</FormLabel>
            <Input
              id="furtherCharge"
              name="furtherCharge"
              placeholder="Any additional charges"
              value={currentOffence.furtherCharge || ''}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Conditional fields based on conviction status */}
          {currentOffence.convictionStatus === 'convicted' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormLabel htmlFor="sentence">Sentence</FormLabel>
                  <Input
                    id="sentence"
                    name="sentence"
                    placeholder="e.g., 5 years imprisonment"
                    value={currentOffence.sentence || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel htmlFor="sentenceDate">Sentence Date</FormLabel>
                  <Input
                    id="sentenceDate"
                    name="sentenceDate"
                    type="date"
                    value={currentOffence.sentenceDate || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel htmlFor="remission">Remission</FormLabel>
                  <Input
                    id="remission"
                    name="remission"
                    readOnly
                    value={currentOffence.remission || ''}
                  />
                  <p className="text-xs text-muted-foreground">
                    Automatically calculated as 1/3 of the sentence
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <FormLabel htmlFor="nextCourtDate">Next Court Date</FormLabel>
              <Input
                id="nextCourtDate"
                name="nextCourtDate"
                type="date"
                value={currentOffence.nextCourtDate || ''}
                onChange={handleInputChange}
              />
            </div>
          )}
          
          <Button 
            type="button"
            className="mt-4"
            onClick={handleAddOffence}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Offence
          </Button>
        </div>
        
        {form.formState.errors.offences && (
          <p className="text-sm font-medium text-destructive mt-2">
            {form.formState.errors.offences.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Offences;
