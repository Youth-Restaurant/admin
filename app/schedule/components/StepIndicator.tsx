import { Button } from '@/components/ui/button';

export default function StepIndicator({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isFirstStep,
  isLastStep,
  isNextDisabled,
}: {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isNextDisabled: boolean;
}) {
  return (
    <div className='relative mb-12'>
      {/* Step Counter */}
      <p className='text-3xl font-bold text-center mb-2'>
        단계 {currentStep} / {totalSteps}
      </p>
      {/* Progress Bar */}
      <div className='w-full bg-gray-200 rounded-full h-6'>
        <div
          className='bg-blue-600 h-6 rounded-full transition-all duration-300'
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      {/* Navigation Buttons */}
      <div className='flex justify-between my-4'>
        <Button
          variant='outline'
          onClick={onBack}
          disabled={isFirstStep}
          className='text-3xl px-8 py-6'
        >
          이전
        </Button>

        {isLastStep ? (
          <Button
            type='submit'
            className='text-3xl px-8 py-6 bg-green-600 hover:bg-green-700'
          >
            예약 완료
          </Button>
        ) : (
          <Button
            variant='outline'
            onClick={onNext}
            disabled={isNextDisabled}
            className='text-3xl px-8 py-6'
          >
            다음
          </Button>
        )}
      </div>
    </div>
  );
}
